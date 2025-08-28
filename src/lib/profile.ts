
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_type: 'freelancer' | 'client';
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile {
  id: string;
  bio?: string;
  hourly_rate?: number;
  experience_years?: number;
  equipment?: string;
  portfolio_links?: string[];
  is_pro_member: boolean;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  created_at: string;
  updated_at: string;
}

// Get user's own profile (full access due to RLS policy)
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

// Get public freelancer profile data (limited by RLS policies)
export const getPublicFreelancerProfile = async (userId: string) => {
  try {
    // Try to use the secure function first
    const { data, error } = await supabase
      .rpc('get_public_freelancer_info', { freelancer_id: userId });

    if (error) {
      console.error('Error using secure function:', error);
      // Fallback to direct query (will be filtered by RLS)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('profiles')
        .select('id, full_name, city, state, avatar_url')
        .eq('id', userId)
        .eq('user_type', 'freelancer')
        .single();

      if (fallbackError) {
        console.error('Error fetching public profile:', fallbackError);
        return null;
      }

      return fallbackData;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('Error fetching public freelancer profile:', err);
    return null;
  }
};

export const getFreelancerProfile = async (userId: string): Promise<FreelancerProfile | null> => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching freelancer profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
};

export const updateFreelancerProfile = async (userId: string, updates: Partial<FreelancerProfile>) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating freelancer profile:', error);
    throw error;
  }

  return data;
};
