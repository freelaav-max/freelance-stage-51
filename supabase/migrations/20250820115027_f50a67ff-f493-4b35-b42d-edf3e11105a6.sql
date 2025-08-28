-- Fix critical security issue: Remove overly permissive public access to profiles table
-- This policy currently exposes email, phone, and other sensitive data publicly

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a new, secure policy that only allows users to view their own full profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a more restrictive policy for public freelancer profile access
-- This will be used only by the secure RPC function for public data
CREATE POLICY "Secure public freelancer access" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'freelancer'::user_type 
  AND current_setting('app.bypass_rls', true)::boolean = true
);

-- Update the existing secure function to properly handle RLS bypass
-- This function will be the ONLY way to access public freelancer data
CREATE OR REPLACE FUNCTION public.get_public_freelancer_info(freelancer_id uuid)
RETURNS TABLE(
  id uuid, 
  full_name text, 
  city text, 
  state text, 
  avatar_url text, 
  bio text, 
  hourly_rate numeric, 
  experience_years integer, 
  rating numeric, 
  total_reviews integer, 
  is_pro_member boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Temporarily bypass RLS for this secure function only
  PERFORM set_config('app.bypass_rls', 'true', true);
  
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.city,
    p.state,
    p.avatar_url,
    fp.bio,
    fp.hourly_rate,
    fp.experience_years,
    fp.rating,
    fp.total_reviews,
    fp.is_pro_member
  FROM profiles p
  LEFT JOIN freelancer_profiles fp ON p.id = fp.id
  WHERE p.id = freelancer_id 
    AND p.user_type = 'freelancer';
    
  -- Reset the bypass setting
  PERFORM set_config('app.bypass_rls', 'false', true);
END;
$$;

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION public.get_public_freelancer_info(uuid) TO anon, authenticated;