import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { fetchPosts, fetchTrending } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eclipse Tech — Curiosidades, tecnologia e cultura pop em 2026" },
      {
        name: "description",
        content:
          "Portal de conteúdo viral: curiosidades, bizarro, tecnologia, séries, músicas e mais. Eclipse Tech, o futuro do entretenimento.",
      },
      { property: "og:title", content: "Eclipse Tech" },
      { property: "og:description", content: "Curiosidades, tecnologia e cultura pop em 2026." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", "feed"],
    queryFn: () => fetchPosts({ limit: 30 }),
  });
  const { data: trending = [] } = useQuery({
    queryKey: ["posts", "trending"],
    queryFn: () => fetchTrending(5),
  });

  const hero = posts[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 grid-bg">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon">
              <Sparkles className="h-3 w-3" /> Edição 2026
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-6xl md:text-7xl">
              O futuro do <span className="text-gradient-neon">entretenimento</span>
              <br />
              começa aqui.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Curiosidades, tecnologia, séries, bandas e o bizarro do mundo —
              tudo em um portal feito para a era pós-streaming.
            </p>
            {hero && (
              <Link
                to="/post/$slug"
                params={{ slug: hero.slug }}
                className="group mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_28px_var(--neon-soft)]"
              >
                Ler artigo em destaque
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories pills */}
      <section className="border-b border-border/50">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/c/$slug"
              params={{ slug: c.slug }}
              className="shrink-0 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-neon hover:text-neon"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Feed + Sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-6 font-display text-2xl font-bold">
              Feed <span className="text-neon">infinito</span>
            </h2>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[16/12] animate-pulse rounded-xl bg-card" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((p, i) => (
                  <PostCard key={p.id} post={p} index={i} />
                ))}
              </div>
            )}
          </div>
          <TrendingSidebar posts={trending} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
