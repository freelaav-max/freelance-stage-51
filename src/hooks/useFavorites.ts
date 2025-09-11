import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteFreelancer {
  id: string;
  freelancer_id: string;
  created_at: string;
  freelancer: {
    full_name: string;
    avatar_url?: string;
    city?: string;
    state?: string;
    specialties: string[];
    hourly_rate?: number;
    rating?: number;
    total_reviews?: number;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_favorites')
        .select(`
          id,
          freelancer_id,
          created_at,
          freelancer:profiles!user_favorites_freelancer_id_fkey(
            full_name,
            avatar_url,
            city,
            state,
            specialties
          ),
          freelancer_profile:freelancer_profiles!user_favorites_freelancer_id_fkey(
            hourly_rate,
            rating,
            total_reviews
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Merge freelancer and freelancer_profile data
      const processedFavorites = data?.map(fav => ({
        ...fav,
        freelancer: {
          ...fav.freelancer,
          hourly_rate: fav.freelancer_profile?.hourly_rate,
          rating: fav.freelancer_profile?.rating,
          total_reviews: fav.freelancer_profile?.total_reviews,
        }
      })) || [];

      setFavorites(processedFavorites as FavoriteFreelancer[]);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (freelancerId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('freelancer_id', freelancerId);

      if (error) throw error;

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.freelancer_id !== freelancerId));
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      return false;
    }
  };

  const getFavoriteCount = () => favorites.length;

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    removeFavorite,
    favoriteCount: getFavoriteCount(),
  };
};