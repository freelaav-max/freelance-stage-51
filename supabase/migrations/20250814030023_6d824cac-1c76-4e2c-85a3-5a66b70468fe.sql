
-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('freelancer', 'client');

-- Create enum for freelancer specialties
CREATE TYPE public.specialty AS ENUM (
  'audio_engineer',
  'sound_technician', 
  'camera_operator',
  'video_editor',
  'lighting_technician',
  'dj',
  'vj',
  'live_streaming',
  'photographer',
  'videographer'
);

-- Create profiles table that extends auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_type public.user_type NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create freelancer_profiles table for freelancer-specific data
CREATE TABLE public.freelancer_profiles (
  id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  experience_years INTEGER,
  equipment TEXT,
  portfolio_links TEXT[],
  is_pro_member BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create freelancer_specialties junction table
CREATE TABLE public.freelancer_specialties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID NOT NULL REFERENCES public.freelancer_profiles(id) ON DELETE CASCADE,
  specialty public.specialty NOT NULL,
  UNIQUE(freelancer_id, specialty)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_specialties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for freelancer_profiles
CREATE POLICY "Everyone can view freelancer profiles" 
  ON public.freelancer_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Freelancers can update own profile" 
  ON public.freelancer_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Freelancers can insert own profile" 
  ON public.freelancer_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for freelancer_specialties
CREATE POLICY "Everyone can view freelancer specialties" 
  ON public.freelancer_specialties FOR SELECT 
  USING (true);

CREATE POLICY "Freelancers can manage own specialties" 
  ON public.freelancer_specialties FOR ALL 
  USING (auth.uid() = freelancer_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_freelancer_profiles_updated_at
  BEFORE UPDATE ON public.freelancer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
