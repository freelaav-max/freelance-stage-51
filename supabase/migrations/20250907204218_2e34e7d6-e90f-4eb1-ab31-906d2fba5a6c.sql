-- Fix security linter warnings

-- 1. Fix function search path issues
ALTER FUNCTION public.audit_sensitive_changes() SET search_path = public;
ALTER FUNCTION public.get_public_freelancer_info(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- 2. Create secure helper function for profile access
CREATE OR REPLACE FUNCTION get_public_profile_data(profile_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  city text,
  state text,
  avatar_url text,
  user_type user_type
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.city,
    p.state,
    p.avatar_url,
    p.user_type
  FROM profiles p
  WHERE p.id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;