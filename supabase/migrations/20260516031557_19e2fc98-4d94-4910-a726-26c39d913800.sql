ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS entities text[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_posts_entities ON public.posts USING GIN (entities);