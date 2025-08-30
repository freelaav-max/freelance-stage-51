
-- 1. Criar trigger para criação automática de perfis
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, user_type, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'user_type', 'client')::user_type,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  
  -- If user is a freelancer, create freelancer profile
  IF COALESCE(new.raw_user_meta_data->>'user_type', 'client') = 'freelancer' THEN
    INSERT INTO public.freelancer_profiles (id)
    VALUES (new.id);
  END IF;
  
  RETURN new;
END;
$function$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Enable realtime for critical tables
ALTER TABLE public.offers REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
