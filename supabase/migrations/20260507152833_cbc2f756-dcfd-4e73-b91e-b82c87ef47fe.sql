
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users see own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins see all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Replace restrictive write policies on posts: allow admins
DROP POLICY IF EXISTS "Deny public deletes" ON public.posts;
DROP POLICY IF EXISTS "Deny public inserts" ON public.posts;
DROP POLICY IF EXISTS "Deny public updates" ON public.posts;
DROP POLICY IF EXISTS "Public can read published posts" ON public.posts;

CREATE POLICY "Public reads published posts"
  ON public.posts FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update posts"
  ON public.posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete posts"
  ON public.posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
