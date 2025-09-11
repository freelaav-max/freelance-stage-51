import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CalendarEvent {
  id: string;
  start_datetime: string;
  end_datetime: string;
  type: 'platform_booking' | 'external_commitment' | 'unavailable_period';
  title?: string;
  description?: string;
  location?: string;
}

export const useFreelancerCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.rpc('get_freelancer_availability', {
        p_freelancer_id: user.id,
        p_start_date: startDate.toISOString().split('T')[0],
        p_end_date: endDate.toISOString().split('T')[0]
      });

      if (error) throw error;
      setEvents((data || []) as CalendarEvent[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar eventos';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    start_datetime: string;
    end_datetime: string;
    type: 'external_commitment' | 'unavailable_period';
    title?: string;
    description?: string;
    location?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('create_calendar_event', {
        p_start_datetime: eventData.start_datetime,
        p_end_datetime: eventData.end_datetime,
        p_type: eventData.type,
        p_title: eventData.title || null,
        p_description: eventData.description || null,
        p_location: eventData.location || null
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso"
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('freelancer_calendar_events')
        .update(updates)
        .eq('id', eventId)
        .eq('freelancer_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso"
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('freelancer_calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('freelancer_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Evento removido com sucesso"
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover evento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};