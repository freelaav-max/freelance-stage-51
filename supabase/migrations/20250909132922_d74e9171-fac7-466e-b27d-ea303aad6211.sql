-- Create referral_codes table
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL UNIQUE,
  referral_code_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for referral_codes
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for referral_codes
CREATE POLICY "Users can view their own referral codes"
ON public.referral_codes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral codes"
ON public.referral_codes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable RLS for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals for themselves"
ON public.referrals
FOR INSERT
WITH CHECK (auth.uid() = referred_id);

-- Function to resolve referral code
CREATE OR REPLACE FUNCTION public.resolve_referral_code(p_code text)
RETURNS TABLE(referrer_id uuid, referral_code_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id, id
  FROM referral_codes
  WHERE code = p_code;
END;
$$;

-- Function to increment referral clicks
CREATE OR REPLACE FUNCTION public.increment_referral_click(p_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE referral_codes
  SET clicks = clicks + 1
  WHERE code = p_code;
END;
$$;

-- Function to get or create referral code
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code(p_user_id uuid)
RETURNS TABLE(code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_attempts integer := 0;
BEGIN
  -- Try to get existing code
  SELECT referral_codes.code INTO v_code
  FROM referral_codes
  WHERE user_id = p_user_id;
  
  IF FOUND THEN
    RETURN QUERY SELECT v_code;
    RETURN;
  END IF;
  
  -- Generate new code
  LOOP
    v_attempts := v_attempts + 1;
    v_code := upper(substring(md5(random()::text || p_user_id::text) from 1 for 8));
    
    BEGIN
      INSERT INTO referral_codes (user_id, code)
      VALUES (p_user_id, v_code);
      
      RETURN QUERY SELECT v_code;
      RETURN;
    EXCEPTION WHEN unique_violation THEN
      IF v_attempts > 10 THEN
        RAISE EXCEPTION 'Failed to generate unique referral code after 10 attempts';
      END IF;
    END;
  END LOOP;
END;
$$;

-- Trigger for updated_at on referrals
CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();