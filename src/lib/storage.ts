
import { supabase } from '@/integrations/supabase/client';

export const resolveStorageUrl = (
  bucket: 'avatars' | 'portfolio',
  value?: string | null
): string | undefined => {
  if (!value) return undefined;
  
  // Se já é uma URL completa, retorna como está
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  
  // Resolve URL do Supabase Storage
  const { data } = supabase.storage.from(bucket).getPublicUrl(value);
  return data.publicUrl;
};

export const getAvatarUrl = (avatarPath?: string | null): string | undefined => {
  return resolveStorageUrl('avatars', avatarPath);
};

export const getPortfolioImageUrl = (imagePath?: string | null): string | undefined => {
  return resolveStorageUrl('portfolio', imagePath);
};
