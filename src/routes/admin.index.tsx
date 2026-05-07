import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminPostsList,
});

interface Row {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
}

function AdminPostsList() {
  const [posts, setPosts] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("id,title,slug,category,published,featured,views,created_at")
      .order("created_at", { ascending: false });
    setPosts((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublished(p: Row) {
    await supabase.from("posts").update({ published: !p.published }).eq("id", p.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-semibold">Todos os posts ({posts.length})</h2>
        <Link to="/admin/new">
          <Button size="sm">+ Novo post</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead className="bg-surface/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Views</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-surface/30">
                <td className="p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">/{p.slug}</div>
                </td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3">
                  <button
                    onClick={() => togglePublished(p)}
                    className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${
                      p.published ? "bg-neon/10 text-neon" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {p.published ? "Publicado" : "Rascunho"}
                  </button>
                </td>
                <td className="p-3 text-muted-foreground">{p.views}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link to="/admin/edit/$id" params={{ id: p.id }}>
                      <Button size="sm" variant="outline"><Pencil className="h-3 w-3" /></Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum post ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
