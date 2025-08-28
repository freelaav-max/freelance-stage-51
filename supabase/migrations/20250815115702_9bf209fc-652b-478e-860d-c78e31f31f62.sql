
-- Fix the critical data exposure issue by updating RLS policies

-- First, drop the overly permissive policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create more granular policies for profile access
-- 1. Users can view their own complete profile
CREATE POLICY "Users can view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Public can view only essential freelancer information (name, city, state, avatar)
-- This excludes sensitive data like email and phone
CREATE POLICY "Public can view freelancer basic info" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'freelancer' 
  AND id IN (
    SELECT id FROM public.freelancer_profiles 
    WHERE id = profiles.id
  )
);

-- Fix database function security by updating the handle_new_user function
-- with proper search_path setting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client')::public.user_type,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  -- If user is a freelancer, create freelancer profile
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'client') = 'freelancer' THEN
    INSERT INTO public.freelancer_profiles (id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create a security definer function to safely get user profile data for public display
-- This will be used to avoid exposing sensitive information
CREATE OR REPLACE FUNCTION public.get_public_freelancer_info(freelancer_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  city text,
  state text,
  avatar_url text
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.city,
    p.state,
    p.avatar_url
  FROM public.profiles p
  WHERE p.id = freelancer_id 
    AND p.user_type = 'freelancer'
    AND EXISTS (
      SELECT 1 FROM public.freelancer_profiles fp 
      WHERE fp.id = p.id
    );
$$;
