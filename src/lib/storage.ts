
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
  
  // Se é um path relativo que começa com /, remove para evitar path duplo
  const cleanPath = value.startsWith('/') ? value.substring(1) : value;
  
  try {
    // Resolve URL do Supabase Storage
    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
    
    // Verifica se a URL foi gerada corretamente
    if (data?.publicUrl && data.publicUrl !== '') {
      return data.publicUrl;
    }
    
    console.warn(`Failed to generate storage URL for ${bucket}/${cleanPath}`);
    return undefined;
  } catch (error) {
    console.error(`Error resolving storage URL for ${bucket}/${cleanPath}:`, error);
    return undefined;
  }
};

export const getAvatarUrl = (avatarPath?: string | null): string | undefined => {
  return resolveStorageUrl('avatars', avatarPath);
};

export const getPortfolioImageUrl = (imagePath?: string | null): string | undefined => {
  return resolveStorageUrl('portfolio', imagePath);
};
