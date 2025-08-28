
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from '@/components/ui/use-toast';
import { Notification, NotificationPreferences } from '@/types/notification';
import { useAuth } from '@/contexts/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Mock API call - replace with actual API
      return mockNotifications;
    },
    enabled: !!user,
    refetchInterval: 60000,
  });

  // Fetch notification preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery<NotificationPreferences>({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      // Mock API call - replace with actual API
      return mockPreferences;
    },
    enabled: !!user,
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<NotificationPreferences>) => {
      // Mock API call - replace with actual API
      return { ...preferences, ...newPreferences };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram salvas.",
      });
    },
  });

  // Mark as read mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // Mock API call - replace with actual API
      console.log('Marking notification as read:', notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // Mock API call - replace with actual API
      console.log('Marking all notifications as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Socket.io connection for real-time notifications
  useEffect(() => {
    if (!user) return;

    // Mock socket connection - replace with actual socket.io
    const mockSocket = {
      on: (event: string, callback: Function) => {
        console.log(`Listening to ${event}`);
      },
      disconnect: () => {
        console.log('Socket disconnected');
      }
    };

    // Real implementation would be:
    // const socket = io(process.env.REACT_APP_API_URL);
    // socket.on('notification:new', (notification: Notification) => {
    //   queryClient.setQueryData<Notification[]>(['notifications'], old => {
    //     return old ? [notification, ...old] : [notification];
    //   });
    //   
    //   toast({
    //     title: notification.title,
    //     description: notification.content,
    //   });
    // });

    return () => {
      mockSocket.disconnect();
    };
  }, [user, queryClient]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    preferences,
    unreadCount,
    isLoading,
    preferencesLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
  };
};

// Mock data - replace with actual API calls
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'offer',
    title: 'Nova oferta recebida',
    content: 'Maria Santos enviou uma oferta para evento corporativo',
    referenceId: 'offer1',
    referenceType: 'offer',
    isRead: false,
    sentToWhatsApp: true,
    whatsAppStatus: 'delivered',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    userId: 'user1',
    type: 'booking',
    title: 'Booking confirmado',
    content: 'Seu booking para 30/01/2024 foi confirmado',
    referenceId: 'booking1',
    referenceType: 'booking',
    isRead: true,
    sentToWhatsApp: false,
    createdAt: new Date('2024-01-14T15:45:00'),
  },
  {
    id: '3',
    userId: 'user1',
    type: 'payment',
    title: 'Pagamento recebido',
    content: 'Você recebeu R$ 800,00 pelo evento realizado',
    referenceId: 'payment1',
    referenceType: 'payment',
    isRead: false,
    sentToWhatsApp: true,
    whatsAppStatus: 'read',
    createdAt: new Date('2024-01-13T09:15:00'),
  },
];

const mockPreferences: NotificationPreferences = {
  inApp: {
    offers: true,
    bookings: true,
    payments: true,
    messages: true,
    reviews: true,
  },
  whatsapp: {
    offers: true,
    bookings: true,
    payments: false,
    messages: false,
    reviews: true,
  },
};
