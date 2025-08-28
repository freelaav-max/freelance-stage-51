-- Drop and recreate the incomplete tables structure, only if exists
DO $$ 
BEGIN
  -- Drop existing incomplete tables if they exist
  DROP TABLE IF EXISTS audit_logs CASCADE;
  DROP TABLE IF EXISTS subscriptions CASCADE;
  DROP TABLE IF EXISTS reviews CASCADE;
  DROP TABLE IF EXISTS payments CASCADE;
  DROP TABLE IF EXISTS bookings CASCADE;
  DROP TABLE IF EXISTS messages CASCADE;
  DROP TABLE IF EXISTS offers CASCADE;
  DROP TABLE IF EXISTS availabilities CASCADE;
  DROP TABLE IF EXISTS portfolio_items CASCADE;
  DROP TABLE IF EXISTS freelancer_specialties CASCADE;
  DROP TABLE IF EXISTS freelancer_profiles CASCADE;
  DROP TABLE IF EXISTS profiles CASCADE;
  
  -- Drop existing types if they exist
  DROP TYPE IF EXISTS subscription_status CASCADE;
  DROP TYPE IF EXISTS availability_status CASCADE;
  DROP TYPE IF EXISTS payment_status CASCADE;
  DROP TYPE IF EXISTS booking_status CASCADE;
  DROP TYPE IF EXISTS offer_status CASCADE;
  DROP TYPE IF EXISTS specialty CASCADE;
  -- Note: user_type already exists, so we won't drop it
END
$$;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create new ENUM types that don't exist yet
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'counter_proposed');
CREATE TYPE booking_status AS ENUM ('confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE availability_status AS ENUM ('available', 'unavailable', 'partially_available');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE specialty AS ENUM (
  'audio_engineer', 'sound_technician', 'mixing_engineer', 'mastering_engineer',
  'camera_operator', 'video_editor', 'colorist', 'motion_graphics',
  'lighting_technician', 'gaffer', 'electrician',
  'live_streaming', 'broadcast_engineer', 'video_streaming',
  'dj', 'vj', 'live_performance',
  'producer', 'director', 'assistant_director',
  'photographer', 'drone_operator', 'steadicam_operator'
);

-- Create profiles table (main user profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brazil',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create freelancer_profiles table (extended freelancer data)
CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  experience_years INTEGER,
  equipment TEXT,
  portfolio_links TEXT[],
  is_pro_member BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  profile_strength INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create freelancer_specialties table (many-to-many relationship)
CREATE TABLE freelancer_specialties (
  freelancer_id UUID REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  specialty specialty NOT NULL,
  PRIMARY KEY (freelancer_id, specialty)
);

-- Create portfolio_items table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create availabilities table
CREATE TABLE availabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status availability_status NOT NULL,
  start_time TIME,
  end_time TIME,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(freelancer_id, date)
);

-- Create offers table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  specialty specialty NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  event_time TEXT,
  location TEXT NOT NULL,
  duration INTEGER, -- in hours
  budget DECIMAL(10,2) NOT NULL,
  status offer_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID UNIQUE REFERENCES offers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'confirmed',
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  contract_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  gateway_id TEXT,
  gateway_data JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  giver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id, giver_id)
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT DEFAULT 'Pro',
  price DECIMAL(10,2) NOT NULL,
  status subscription_status NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  gateway_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freelancer_profiles_updated_at
    BEFORE UPDATE ON freelancer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can view all freelancer profiles (public), but only edit their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
FOR SELECT USING (user_type = 'freelancer' OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Freelancer profiles: Public read, owner write
CREATE POLICY "Freelancer profiles are publicly viewable" ON freelancer_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own freelancer profile" ON freelancer_profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own freelancer profile" ON freelancer_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Freelancer specialties: Public read, owner write
CREATE POLICY "Freelancer specialties are publicly viewable" ON freelancer_specialties
FOR SELECT USING (true);

CREATE POLICY "Users can manage own specialties" ON freelancer_specialties
FOR ALL USING (auth.uid() = freelancer_id);

-- Portfolio items: Public read, owner write
CREATE POLICY "Portfolio items are publicly viewable" ON portfolio_items
FOR SELECT USING (true);

CREATE POLICY "Users can manage own portfolio" ON portfolio_items
FOR ALL USING (auth.uid() = freelancer_id);

-- Availabilities: Public read, owner write
CREATE POLICY "Availabilities are publicly viewable" ON availabilities
FOR SELECT USING (true);

CREATE POLICY "Users can manage own availability" ON availabilities
FOR ALL USING (auth.uid() = freelancer_id);

-- Offers: Only involved parties can see
CREATE POLICY "Users can view their own offers" ON offers
FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Clients can create offers" ON offers
FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update offers they're involved in" ON offers
FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Messages: Only involved parties can see
CREATE POLICY "Users can view their own messages" ON messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" ON messages
FOR UPDATE USING (auth.uid() = receiver_id);

-- Bookings: Only involved parties can see
CREATE POLICY "Users can view their own bookings" ON bookings
FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "System can manage bookings" ON bookings
FOR ALL USING (true);

-- Payments: Only user can see their own
CREATE POLICY "Users can view their own payments" ON payments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage payments" ON payments
FOR ALL USING (true);

-- Reviews: Public read, only involved parties can write
CREATE POLICY "Reviews are publicly viewable" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON reviews
FOR INSERT WITH CHECK (auth.uid() = giver_id);

CREATE POLICY "Users can update their own reviews" ON reviews
FOR UPDATE USING (auth.uid() = giver_id OR auth.uid() = receiver_id);

-- Subscriptions: Only user can see their own
CREATE POLICY "Users can view their own subscription" ON subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subscription" ON subscriptions
FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically create freelancer profile when user signs up as freelancer
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to get public freelancer info
CREATE OR REPLACE FUNCTION get_public_freelancer_info(freelancer_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  city TEXT,
  state TEXT,
  avatar_url TEXT,
  bio TEXT,
  hourly_rate DECIMAL,
  experience_years INTEGER,
  rating DECIMAL,
  total_reviews INTEGER,
  is_pro_member BOOLEAN
) AS $$
BEGIN
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;