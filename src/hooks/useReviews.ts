import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  response?: string;
  responded_at?: string;
  giver: {
    full_name: string;
    avatar_url?: string;
  };
  receiver: {
    full_name: string;
    avatar_url?: string;
  };
}

export const useReviews = (targetUserId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          response,
          created_at,
          responded_at,
          giver:profiles!reviews_giver_id_fkey(full_name, avatar_url),
          receiver:profiles!reviews_receiver_id_fkey(full_name, avatar_url)
        `)
        .eq('receiver_id', targetUserId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setReviews(data as Review[]);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const respondToReview = async (reviewId: string, response: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          response: response.trim(),
          responded_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .eq('receiver_id', user.id);

      if (error) throw error;

      // Refresh reviews
      await fetchReviews();
      return true;
    } catch (err) {
      console.error('Error responding to review:', err);
      return false;
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  useEffect(() => {
    fetchReviews();
  }, [targetUserId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    respondToReview,
    averageRating: getAverageRating(),
    totalReviews: reviews.length,
    ratingDistribution: getRatingDistribution(),
  };
};