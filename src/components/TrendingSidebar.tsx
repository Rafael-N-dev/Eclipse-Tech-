import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import type { PostCardData } from "./PostCard";
import { categoryLabel } from "@/lib/categories";

export function TrendingSidebar({ posts }: { posts: PostCardData[] }) {
  return (
    <aside className="sticky top-20 space-y-4">
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neon" />
          <h2 className="text-sm font-semibold uppercase tracking-widest">Trending agora</h2>
        </div>
        <ol className="space-y-4">
          {posts.map((p, i) => (
            <li key={p.id}>
              <Link
                to="/post/$slug"
                params={{ slug: p.slug }}
                className="group flex gap-3"
              >
                <span className="font-display text-2xl font-bold text-neon/40 transition-colors group-hover:text-neon">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-neon">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {categoryLabel(p.category)} · {p.views.toLocaleString("pt-BR")} views
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
