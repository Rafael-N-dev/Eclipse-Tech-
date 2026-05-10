import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Eye, Flame } from "lucide-react";
import { categoryLabel } from "@/lib/categories";

export interface PostCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  reading_time: number;
  views: number;
  featured?: boolean | null;
}

export function PostCard({ post, index = 0 }: { post: PostCardData; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-neon/50 hover:shadow-[0_0_28px_var(--neon-soft)]"
    >
      <Link to="/post/$slug" params={{ slug: post.slug }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full border border-neon/40 bg-background/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon backdrop-blur">
              {categoryLabel(post.category)}
            </span>
            {post.featured && (
              <span className="flex items-center gap-1 rounded-full bg-neon/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-neon">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.reading_time} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {post.views.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
