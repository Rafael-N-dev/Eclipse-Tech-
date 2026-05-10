import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/categories";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Use apenas a-z, 0-9 e -"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).max(50000),
  cover_image: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1),
  reading_time: z.number().int().min(1).max(120),
  published: z.boolean(),
  featured: z.boolean(),
});

export interface PostFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  reading_time: number;
  published: boolean;
  featured: boolean;
}

export function PostForm({ initial }: { initial?: PostFormValues }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [v, setV] = useState<PostFormValues>(
    initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      category: "curiosidades",
      reading_time: 3,
      published: true,
      featured: false,
    },
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof PostFormValues>(k: K, val: PostFormValues[K]) {
    setV((x) => ({ ...x, [k]: val }));
  }

  function autoSlug() {
    if (!v.slug && v.title) {
      set(
        "slug",
        v.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      );
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isAdmin) {
      setError("Acesso negado: você precisa ser administrador.");
      return;
    }
    const parsed = schema.safeParse(v);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const payload = { ...parsed.data, cover_image: parsed.data.cover_image || null };
    const res = initial?.id
      ? await supabase.from("posts").update(payload).eq("id", initial.id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Título</label>
        <Input value={v.title} onChange={(e) => set("title", e.target.value)} onBlur={autoSlug} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Slug</label>
          <Input
            value={v.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="meu-post"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Categoria
          </label>
          <select
            value={v.category}
            onChange={(e) => set("category", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Imagem de capa (URL)
        </label>
        <Input
          value={v.cover_image}
          onChange={(e) => set("cover_image", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Resumo</label>
        <Textarea rows={2} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Conteúdo (Markdown)
        </label>
        <Textarea
          rows={16}
          value={v.content}
          onChange={(e) => set("content", e.target.value)}
          className="font-mono text-sm"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Tempo de leitura (min)
          </label>
          <Input
            type="number"
            min={1}
            max={120}
            value={v.reading_time}
            onChange={(e) => set("reading_time", parseInt(e.target.value) || 1)}
          />
        </div>
        <label className="flex items-center gap-2 pt-5 text-sm">
          <input
            type="checkbox"
            checked={v.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Publicado
        </label>
        <label className="flex items-center gap-2 pt-5 text-sm">
          <input
            type="checkbox"
            checked={v.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Destaque
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin" })}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
