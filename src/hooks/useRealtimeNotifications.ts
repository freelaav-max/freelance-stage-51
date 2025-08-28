import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NotificationState {
  unreadCount: number;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useRealtimeNotifications = (): NotificationState => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Subscribe to offers table for new offers and status updates
    const offersChannel = supabase
      .channel('offers_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'offers',
          filter: `freelancer_id=eq.${user.id}`,
        },
        (payload) => {
          toast({
            title: 'Nova oferta recebida!',
            description: `Você recebeu uma nova oferta: ${payload.new.title}`,
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `client_id=eq.${user.id}`,
        },
        (payload) => {
          const statusMap: Record<string, string> = {
            accepted: 'aceita',
            rejected: 'rejeitada',
            counter_offer: 'recebeu uma contraproposta'
          };
          
          const statusText = statusMap[payload.new.status] || 'atualizada';
          
          toast({
            title: 'Oferta atualizada',
            description: `Sua oferta "${payload.new.title}" foi ${statusText}`,
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to messages table for new messages
    const messagesChannel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          toast({
            title: 'Nova mensagem',
            description: 'Você recebeu uma nova mensagem',
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(offersChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  const incrementUnread = () => {
    setUnreadCount(prev => prev + 1);
  };

  const clearUnread = () => {
    setUnreadCount(0);
  };

  return {
    unreadCount,
    incrementUnread,
    clearUnread,
  };
};