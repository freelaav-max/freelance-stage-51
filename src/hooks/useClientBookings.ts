import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BookingWithFreelancer {
  id: string;
  client_id: string;
  freelancer_id: string;
  offer_id: string;
  location: string;
  event_date: string;
  total_amount: number;
  deposit_amount: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
  freelancer: {
    full_name: string;
    avatar_url?: string;
  };
  offer: {
    title: string;
    specialty: string;
    event_time?: string;
  };
}

export const useClientBookings = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState<BookingWithFreelancer[]>([]);
  const [pastBookings, setPastBookings] = useState<BookingWithFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          freelancer:profiles!bookings_freelancer_id_fkey(full_name, avatar_url),
          offer:offers!bookings_offer_id_fkey(title, specialty, event_time)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const bookings = data as BookingWithFreelancer[];
      
      setActiveBookings(bookings.filter(b => 
        b.status === 'confirmed' || b.status === 'in_progress'
      ));
      
      setPastBookings(bookings.filter(b => 
        b.status === 'completed' || b.status === 'cancelled'
      ));

    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  return { 
    activeBookings, 
    pastBookings, 
    loading, 
    error, 
    refetch: fetchBookings 
  };
};