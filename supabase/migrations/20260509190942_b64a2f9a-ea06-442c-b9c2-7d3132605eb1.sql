-- Fix: do not use email as display_name fallback
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

-- Scrub existing profiles where display_name leaked the email
UPDATE public.profiles p
SET display_name = NULL
FROM auth.users u
WHERE p.user_id = u.id
  AND p.display_name = u.email;

-- Ensure anon/authenticated can execute has_role (used in posts RLS policy)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;