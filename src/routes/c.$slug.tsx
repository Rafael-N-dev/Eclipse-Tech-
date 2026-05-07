import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { fetchPosts } from "@/lib/posts";
import { CATEGORIES, categoryLabel } from "@/lib/categories";

export const Route = createFileRoute("/c/$slug")({
  beforeLoad: ({ params }) => {
    if (!CATEGORIES.find((c) => c.slug === params.slug)) {
      throw notFound();
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `${categoryLabel(params.slug)} — Eclipse Tech` },
      {
        name: "description",
        content: `Os melhores artigos de ${categoryLabel(params.slug)} no Eclipse Tech.`,
      },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", "category", slug],
    queryFn: () => fetchPosts({ category: slug, limit: 50 }),
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="border-b border-border/50 grid-bg">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-neon">Categoria</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {categoryLabel(slug)}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "artigo" : "artigos"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[16/12] animate-pulse rounded-xl bg-card" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Nenhum artigo nesta categoria ainda.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
