-- Create user_favorites table for favorites functionality
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, freelancer_id)
);

-- Enable RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update freelancer rating
CREATE OR REPLACE FUNCTION public.update_freelancer_rating(freelancer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL;
  review_count INTEGER;
BEGIN
  -- Calculate average rating and count
  SELECT 
    ROUND(AVG(rating)::DECIMAL, 2),
    COUNT(*)
  INTO avg_rating, review_count
  FROM reviews 
  WHERE receiver_id = freelancer_id;

  -- Update freelancer profile
  UPDATE freelancer_profiles 
  SET 
    rating = COALESCE(avg_rating, 0),
    total_reviews = COALESCE(review_count, 0),
    updated_at = now()
  WHERE id = freelancer_id;
END;
$$;