import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ClientStats {
  activeBookings: number;
  completedBookings: number;
  favoriteFreelancers: number;
  totalSpent: number;
}

export const useClientStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ClientStats>({
    activeBookings: 0,
    completedBookings: 0,
    favoriteFreelancers: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Get active bookings count
      const { count: activeCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .in('status', ['confirmed']);

      // Get completed bookings count
      const { count: completedCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .eq('status', 'completed');

      // Get total spent
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'paid');

      const totalSpent = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Note: favorites will be implemented when user_favorites table is created
      const favoriteFreelancers = 0;

      setStats({
        activeBookings: activeCount || 0,
        completedBookings: completedCount || 0,
        favoriteFreelancers,
        totalSpent
      });
    } catch (err) {
      console.error('Error fetching client stats:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  return { stats, loading, error, refetch: fetchStats };
};