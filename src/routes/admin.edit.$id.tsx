import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostForm, type PostFormValues } from "@/components/PostForm";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const [data, setData] = useState<PostFormValues | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setMissing(true);
          return;
        }
        setData({
          id: data.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          cover_image: data.cover_image ?? "",
          category: data.category,
          reading_time: data.reading_time,
          published: data.published,
          featured: data.featured,
        });
      });
  }, [id]);

  if (missing) return <p className="text-muted-foreground">Post não encontrado.</p>;
  if (!data) return <p className="text-muted-foreground">Carregando...</p>;
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Editar: {data.title}</h2>
      <PostForm initial={data} />
    </div>
  );
}
