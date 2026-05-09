import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CATEGORIES = [
  "curiosidades",
  "bizarro",
  "tecnologia",
  "saude",
  "entretenimento",
  "musicas",
  "series",
  "bandas",
] as const;

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

async function generatePost(category: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const systemPrompt = `Você é um redator de blog em português brasileiro. Gere um post original, envolvente e informativo. Responda APENAS com JSON válido (sem markdown, sem cercas) no formato:
{"title": string (até 80 chars), "excerpt": string (1-2 frases, até 160 chars), "content": string (markdown, 600-1000 palavras com subtítulos ##), "reading_time": number (minutos, 3-8)}`;

  const userPrompt = `Crie um post de blog inédito da categoria "${category}". Tema variado, atual e curioso. Use markdown com subtítulos. Não inclua o título dentro do content.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI gateway error [${res.status}]: ${txt}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from AI");
  return JSON.parse(content) as {
    title: string;
    excerpt: string;
    content: string;
    reading_time: number;
  };
}

export const Route = createFileRoute("/api/public/hooks/daily-post")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const category =
            CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

          const post = await generatePost(category);

          const baseSlug = slugify(post.title) || `post-${Date.now()}`;
          const slug = `${baseSlug}-${Date.now().toString(36)}`;

          const { data, error } = await supabaseAdmin
            .from("posts")
            .insert({
              title: post.title.slice(0, 200),
              slug,
              excerpt: post.excerpt?.slice(0, 300) ?? null,
              content: post.content,
              category,
              reading_time: Math.max(2, Math.min(15, post.reading_time || 4)),
              published: true,
              featured: false,
            })
            .select("id, slug, title, category")
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
