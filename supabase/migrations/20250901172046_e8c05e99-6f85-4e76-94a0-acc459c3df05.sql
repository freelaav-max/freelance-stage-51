-- Add new columns to profiles table for onboarding system
ALTER TABLE public.profiles 
ADD COLUMN whatsapp text,
ADD COLUMN specialties text[],
ADD COLUMN standard_rate numeric,
ADD COLUMN specific_rates jsonb,
ADD COLUMN available_dates text,
ADD COLUMN profile_complete boolean DEFAULT false;