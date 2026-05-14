import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CATEGORIES = [
  { slug: "series", label: "Séries" },
  { slug: "tecnologia", label: "Tecnologia" },
  { slug: "bandas", label: "Bandas de Rock/Metal" },
  { slug: "filmes", label: "Filmes" },
  { slug: "animes", label: "Animes" },
  { slug: "curiosidades", label: "Curiosidades" },
  { slug: "bizarro", label: "Bizarro" },
] as const;

const BUCKET = "post-covers";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function aiChat(model: string, messages: any[], extra: Record<string, any> = {}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, ...extra }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI gateway error [${res.status}]: ${txt}`);
  }
  return res.json();
}

async function generatePost(category: { slug: string; label: string }) {
  const systemPrompt = `Você é um redator de blog em português brasileiro, descontraído, com voz humana e cheia de personalidade. Escreva como se estivesse batendo papo com um amigo nerd: leve humor, opiniões, referências da cultura pop, parágrafos curtos, sem clichês corporativos. Responda APENAS com JSON válido (sem markdown, sem cercas) no formato:
{"title": string (até 80 chars, chamativo, sem clickbait genérico), "excerpt": string (1-2 frases instigantes, até 160 chars), "content": string (markdown, 600-900 palavras, com 2-3 subtítulos ## e parágrafos curtos), "reading_time": number (3-7), "image_prompt": string (descrição em INGLÊS, vívida e cinematográfica, para gerar uma imagem de capa horizontal 16:9, sem texto na imagem)}`;

  const userPrompt = `Crie um post inédito da categoria "${category.label}". Escolha um tema atual, curioso ou nostálgico dentro desse universo (pode ser uma série, tecnologia recente, banda lendária, filme cult, anime hypado, curiosidade científica ou um caso bizarro real). Tom humano, descontraído, com personalidade. Não inclua o título dentro do content. O image_prompt deve descrever uma capa visualmente impactante relacionada ao tema.`;

  const json = await aiChat(
    "google/gemini-2.5-flash",
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { response_format: { type: "json_object" } }
  );

  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from AI");
  type PostJson = { title: string; excerpt: string; content: string; reading_time: number; image_prompt: string };
  let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned) as PostJson;
  } catch {
    cleaned = cleaned.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
    return JSON.parse(cleaned) as PostJson;
  }
}

async function generateCoverImage(prompt: string, slug: string): Promise<string | null> {
  try {
    const json = await aiChat(
      "google/gemini-2.5-flash-image-preview",
      [
        {
          role: "user",
          content: `Cinematic blog cover image, 16:9, high quality, no text, no watermark. ${prompt}`,
        },
      ],
      { modalities: ["image", "text"] }
    );

    const dataUrl: string | undefined =
      json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl?.startsWith("data:")) {
      console.error("No image returned:", JSON.stringify(json).slice(0, 500));
      return null;
    }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return null;
    const mime = match[1];
    const ext = mime.split("/")[1].split("+")[0] || "png";
    const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));

    const path = `${new Date().getFullYear()}/${slug}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (upErr) {
      console.error("Upload error:", upErr.message);
      return null;
    }
    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("Cover image error:", err instanceof Error ? err.message : err);
    return null;
  }
}

export const Route = createFileRoute("/api/public/hooks/daily-post")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          let preferred: string | undefined;
          try {
            const body = await request.json().catch(() => ({}));
            preferred = body?.category;
          } catch {}

          const category =
            CATEGORIES.find((c) => c.slug === preferred) ??
            CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

          const post = await generatePost(category);

          const baseSlug = slugify(post.title) || `post-${Date.now()}`;
          const slug = `${baseSlug}-${Date.now().toString(36)}`;

          const coverUrl = await generateCoverImage(post.image_prompt, baseSlug);

          const { data, error } = await supabaseAdmin
            .from("posts")
            .insert({
              title: post.title.slice(0, 200),
              slug,
              excerpt: post.excerpt?.slice(0, 300) ?? null,
              content: post.content,
              category: category.slug,
              cover_image: coverUrl,
              reading_time: Math.max(2, Math.min(15, post.reading_time || 4)),
              published: true,
              featured: false,
            })
            .select("id, slug, title, category, cover_image")
            .single();

          if (error) throw error;

          return Response.json({ success: true, post: data });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("daily-post error:", message);
          return new Response(
            JSON.stringify({ success: false, error: message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
