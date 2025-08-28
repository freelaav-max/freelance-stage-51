import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type FreelancerProfile = Database['public']['Tables']['freelancer_profiles']['Row'];
export type FreelancerSpecialty = Database['public']['Tables']['freelancer_specialties']['Row'];
export type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];

export type FreelancerProfileWithUser = FreelancerProfile & {
  profiles: {
    full_name: string;
    email?: string; // Optional since it may not be available in public context
    avatar_url: string | null;
    city: string | null;
    state: string | null;
  };
  city?: string; // Add city for backwards compatibility
  state?: string; // Add state for backwards compatibility
};

export const SPECIALTIES = [
  { value: 'audio_engineer', label: 'Técnico de Som' },
  { value: 'camera_operator', label: 'Operador de Câmera' },
  { value: 'lighting_technician', label: 'Técnico de Iluminação' },
  { value: 'video_editor', label: 'Editor de Vídeo' },
  { value: 'live_streaming', label: 'Streaming ao Vivo' },
  { value: 'post_production', label: 'Pós-produção' },
  { value: 'drone_operator', label: 'Operador de Drone' }
] as const;

export const getFreelancerProfile = async (userId: string): Promise<FreelancerProfileWithUser | null> => {
  const { data: profile, error: profileError } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) return null;

  // Use the secure function to get public profile data
  // This will only return non-sensitive information for public access
  const { data: userProfile, error: userError } = await supabase
    .rpc('get_public_freelancer_info', { freelancer_id: userId });

  if (userError) {
    // Fallback to direct query which will be filtered by RLS policies
    const { data: fallbackProfile, error: fallbackError } = await supabase
      .from('profiles')
      .select('full_name, city, state, avatar_url')
      .eq('id', userId)
      .single();

    if (fallbackError) throw fallbackError;
    
    return {
      ...profile,
      profiles: fallbackProfile,
      city: fallbackProfile.city,
      state: fallbackProfile.state
    } as FreelancerProfileWithUser;
  }

  // If we got data from the secure function, use it
  if (userProfile && userProfile.length > 0) {
    return {
      ...profile,
      profiles: userProfile[0],
      city: userProfile[0].city,
      state: userProfile[0].state
    } as FreelancerProfileWithUser;
  }

  return null;
};

export const getFreelancerSpecialties = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from('freelancer_specialties')
    .select('specialty')
    .eq('freelancer_id', freelancerId);

  if (error) throw error;
  return data.map(item => item.specialty);
};

export const getPortfolioItems = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('freelancer_id', freelancerId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
};

export const updateFreelancerProfile = async (userId: string, updates: Partial<FreelancerProfile>) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFreelancerSpecialties = async (freelancerId: string, specialties: string[]) => {
  // Remove existing specialties
  await supabase
    .from('freelancer_specialties')
    .delete()
    .eq('freelancer_id', freelancerId);

  // Insert new specialties
  if (specialties.length > 0) {
    const { error } = await supabase
      .from('freelancer_specialties')
      .insert(
        specialties.map(specialty => ({
          freelancer_id: freelancerId,
          specialty: specialty as Database['public']['Enums']['specialty']
        }))
      );

    if (error) throw error;
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const uploadPortfolioImage = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('portfolio')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const calculateProfileStrength = (profile: FreelancerProfileWithUser, specialties: string[], portfolioCount: number) => {
  let strength = 0;
  
  if (profile.bio) strength += 20;
  if (profile.hourly_rate) strength += 15;
  if (profile.experience_years) strength += 15;
  if (profile.equipment) strength += 10;
  if (profile.city || profile.profiles?.city) strength += 10;
  if (specialties.length > 0) strength += 15;
  if (portfolioCount > 0) strength += 15;

  return Math.min(strength, 100);
};
