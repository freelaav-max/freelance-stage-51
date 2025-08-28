-- Remove the security definer view and use a safer approach
DROP VIEW IF EXISTS public.freelancer_search_view;

-- Update the search edge function to use only the secure RPC function
-- This ensures we don't have any views that bypass security

-- The existing get_public_freelancer_info function is already secure
-- as it uses SECURITY DEFINER properly and only exposes safe fields