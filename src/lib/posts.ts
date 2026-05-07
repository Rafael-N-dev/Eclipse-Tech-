import { supabase } from "@/integrations/supabase/client";
import type { PostCardData } from "@/components/PostCard";

export interface PostFull extends PostCardData {
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

export async function fetchPosts(opts?: { category?: string; limit?: number; offset?: number }) {
  let q = supabase
    .from("posts_public_view")
    .select("id,title,slug,excerpt,cover_image,category,reading_time,views,featured")
    .order("created_at", { ascending: false });

  if (opts?.category) q = q.eq("category", opts.category);
  if (opts?.limit !== undefined && opts?.offset !== undefined) {
    q = q.range(opts.offset, opts.offset + opts.limit - 1);
  } else if (opts?.limit) {
    q = q.limit(opts.limit);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PostCardData[];
}

export async function fetchTrending(limit = 5) {
  const { data, error } = await supabase
    .from("posts_public_view")
    .select("id,title,slug,excerpt,cover_image,category,reading_time,views,featured")
    .order("views", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as PostCardData[];
}

export async function fetchPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("posts_public_view")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as PostFull | null;
}
