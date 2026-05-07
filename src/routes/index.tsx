import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame, Cpu, Clock, Eye } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { AdSlot } from "@/components/AdSlot";
import { fetchPosts, fetchTrending } from "@/lib/posts";
import { CATEGORIES, categoryLabel } from "@/lib/categories";

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
    queryFn: () => fetchTrending(6),
  });
  const { data: techPosts = [] } = useQuery({
    queryKey: ["posts", "tecnologia"],
    queryFn: () => fetchPosts({ category: "tecnologia", limit: 6 }),
  });

  const heroTrending = trending.slice(0, 3);
  const sidebarTrending = trending.slice(0, 5);
  const feedFirst = posts.slice(0, 4);
  const feedRest = posts.slice(4);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Banner horizontal abaixo do menu */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <AdSlot variant="horizontal" label="Anúncio" />
      </div>

      {/* Hero compacto */}
      <section className="relative overflow-hidden border-b border-border/50 grid-bg">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon">
              <Sparkles className="h-3 w-3" /> Edição 2026
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              O futuro do <span className="text-gradient-neon">entretenimento</span>
              <br className="hidden sm:block" /> começa aqui.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Curiosidades, tecnologia e cultura pop — um portal feito para a era pós-streaming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categorias */}
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

      {/* TRENDING — destaque com cards grandes */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon">
              <Flame className="h-4 w-4" /> Trending
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
              Curiosidades em alta
            </h2>
          </div>
        </div>

        {heroTrending.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Card grande principal */}
            <Link
              to="/post/$slug"
              params={{ slug: heroTrending[0].slug }}
              className="group relative col-span-1 overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-neon/60 hover:shadow-[0_0_38px_var(--neon-soft)] lg:col-span-2 lg:row-span-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-[16/11]">
                {heroTrending[0].cover_image && (
                  <img
                    src={heroTrending[0].cover_image}
                    alt={heroTrending[0].title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neon/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    <Flame className="h-3 w-3" /> Em alta
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight transition-colors group-hover:text-neon sm:text-3xl md:text-4xl">
                    {heroTrending[0].title}
                  </h3>
                  {heroTrending[0].excerpt && (
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                      {heroTrending[0].excerpt}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {heroTrending[0].reading_time} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {heroTrending[0].views.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* 2 cards secundários */}
            {heroTrending.slice(1, 3).map((p) => (
              <Link
                key={p.id}
                to="/post/$slug"
                params={{ slug: p.slug }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-neon/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.cover_image && (
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="rounded-full border border-neon/40 bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon backdrop-blur">
                      {categoryLabel(p.category)}
                    </span>
                    <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-neon">
                      {p.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Anúncio entre seções */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot variant="in-feed" label="Publicidade" />
      </div>

      {/* EXPLORAR TECNOLOGIA — lista limpa */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon">
              <Cpu className="h-4 w-4" /> Tutoriais & análises
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
              Explorar Tecnologia
            </h2>
          </div>
          <Link
            to="/c/$slug"
            params={{ slug: "tecnologia" }}
            className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-neon sm:inline-flex"
          >
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {techPosts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/60 bg-card/40 p-6 text-center text-sm text-muted-foreground">
            Em breve: tutoriais e artigos técnicos publicados aqui.
          </p>
        ) : (
          <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card/40">
            {techPosts.map((p) => (
              <li key={p.id}>
                <Link
                  to="/post/$slug"
                  params={{ slug: p.slug }}
                  className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface/60 sm:gap-5 sm:p-5"
                >
                  {p.cover_image && (
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      className="h-20 w-28 flex-shrink-0 rounded-lg object-cover sm:h-24 sm:w-36"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neon">
                      {categoryLabel(p.category)}
                    </span>
                    <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug transition-colors group-hover:text-neon sm:text-lg">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                        {p.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {p.reading_time} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {p.views.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-neon sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}
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
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {feedFirst.map((p, i) => (
                    <PostCard key={p.id} post={p} index={i} />
                  ))}
                </div>

                {/* Anúncio in-feed entre blocos de notícias */}
                {feedRest.length > 0 && (
                  <div className="my-8">
                    <AdSlot variant="in-feed" label="Publicidade" />
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {feedRest.map((p, i) => (
                    <PostCard key={p.id} post={p} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
          <aside className="space-y-6">
            <TrendingSidebar posts={sidebarTrending} />
            <AdSlot variant="sidebar" label="Anúncio" />
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
