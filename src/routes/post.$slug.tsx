import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Clock, Eye, ThumbsUp, ThumbsDown, Share2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { fetchPostBySlug } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";

export const Route = createFileRoute("/post/$slug")({
  loader: async ({ params }) => {
    const post = await fetchPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Artigo — Eclipse Tech" }] };
    return {
      meta: [
        { title: `${p.title} — Eclipse Tech` },
        { name: "description", content: p.excerpt ?? p.title },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt ?? "" },
        ...(p.cover_image ? [{ property: "og:image", content: p.cover_image }] : []),
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <AdSlot variant="horizontal" label="Anúncio" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <Link
              to="/c/$slug"
              params={{ slug: post.category }}
              className="inline-block rounded-full border border-neon/40 bg-neon-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon"
            >
              {categoryLabel(post.category)}
            </Link>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.reading_time} min de leitura
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {post.views.toLocaleString("pt-BR")} visualizações
              </span>
            </div>
          </motion.header>

          {post.cover_image && (
            <div className="mt-8 overflow-hidden rounded-xl border border-border/60">
              <img src={post.cover_image} alt={post.title} className="h-auto w-full object-cover" />
            </div>
          )}

          <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_strong]:text-neon [&_a]:text-neon [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-neon [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:my-1 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-neon">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Reactions */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-5">
            <div className="flex gap-2">
              <button
                onClick={() => setReaction(reaction === "like" ? null : "like")}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-all ${
                  reaction === "like"
                    ? "border-neon bg-neon-soft text-neon glow-neon-soft"
                    : "border-border hover:border-neon/50"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                {post.likes + (reaction === "like" ? 1 : 0)}
              </button>
              <button
                onClick={() => setReaction(reaction === "dislike" ? null : "dislike")}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-all ${
                  reaction === "dislike"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border hover:border-destructive/50"
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                {post.dislikes + (reaction === "dislike" ? 1 : 0)}
              </button>
            </div>
            <button
              onClick={share}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_18px_var(--neon-soft)]"
            >
              <Share2 className="h-4 w-4" /> Compartilhar
            </button>
          </div>

          {/* Comments placeholder */}
          <div className="mt-10 rounded-xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              💬 Comentários em tempo real chegando em breve. Faça login para ser notificado.
            </p>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <AdSlot variant="sidebar" label="Publicidade" />
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neon">
              Newsletter
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Receba os melhores artigos da semana no seu e-mail.
            </p>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
