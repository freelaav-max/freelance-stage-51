import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export interface AvailabilitySlot {
  id: string;
  freelancer_id: string;
  date: string;
  status: 'available' | 'unavailable' | 'partially_available';
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export const useAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyAvailability = async (startDate?: Date, endDate?: Date) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Use raw SQL for now since the types aren't generated yet
      const { data, error } = await (supabase as any).rpc('get_my_availability', {
        start_date: startDate?.toISOString().split('T')[0] || null,
        end_date: endDate?.toISOString().split('T')[0] || null
      });

      if (error) throw error;
      setAvailability(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar disponibilidade');
    } finally {
      setLoading(false);
    }
  };

  const setAvailabilitySlot = async (
    date: Date,
    status: 'available' | 'unavailable' | 'partially_available',
    startTime?: string,
    endTime?: string
  ) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const dateStr = date.toISOString().split('T')[0];

      // Use raw SQL for now since the types aren't generated yet
      const { data, error } = await (supabase as any).rpc('set_availability', {
        p_date: dateStr,
        p_status: status,
        p_start_time: startTime || null,
        p_end_time: endTime || null
      });

      if (error) throw error;
      
      // Refresh availability after update
      await fetchMyAvailability();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar disponibilidade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPublicAvailability = async (freelancerId: string, startDate?: Date, endDate?: Date) => {
    try {
      setLoading(true);
      setError(null);

      // Use raw SQL for now since the types aren't generated yet
      const { data, error } = await (supabase as any).rpc('get_public_availability', {
        freelancer_id: freelancerId,
        start_date: startDate?.toISOString().split('T')[0] || null,
        end_date: endDate?.toISOString().split('T')[0] || null
      });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar disponibilidade');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyAvailability();
    }
  }, [user?.id]);

  return {
    availability,
    loading,
    error,
    fetchMyAvailability,
    setAvailabilitySlot,
    getPublicAvailability
  };
};