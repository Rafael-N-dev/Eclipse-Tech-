-- Drop the sensitive api_key column from posts (also referenced by posts_public_view)
DROP VIEW IF EXISTS public.posts_public_view;
ALTER TABLE public.posts DROP COLUMN IF EXISTS api_key;

-- Recreate the public view without api_key
CREATE VIEW public.posts_public_view AS
SELECT id, title, slug, excerpt, content, cover_image, category,
       reading_time, views, likes, dislikes, published, featured,
       created_at, updated_at
FROM public.posts
WHERE published = true;

GRANT SELECT ON public.posts_public_view TO anon, authenticated;

-- Explicit deny policies for writes from anon/authenticated roles.
-- Service role bypasses RLS, so admin-side writes still work.
CREATE POLICY "Deny public inserts"
ON public.posts FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny public updates"
ON public.posts FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny public deletes"
ON public.posts FOR DELETE TO anon, authenticated
USING (false);