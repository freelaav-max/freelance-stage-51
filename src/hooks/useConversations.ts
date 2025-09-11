import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getConversations } from '@/lib/messages';

interface ConversationData {
  id: string;
  title: string;
  status: string;
  created_at: string;
  client: {
    full_name: string;
    avatar_url?: string;
  };
  freelancer: {
    full_name: string;
    avatar_url?: string;
  };
  messages: Array<{
    id: string;
    content: string;
    sent_at: string;
    read_at?: string;
    sender_id: string;
  }>;
}

export interface ProcessedConversation {
  id: string;
  otherUserName: string;
  otherUserAvatar?: string;
  otherUserType: 'client' | 'freelancer';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  offerDetails: {
    service: string;
    status: string;
    title: string;
  };
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ProcessedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getConversations(user.id) as ConversationData[];
      
      const processedConversations = data
        .filter(conv => conv.messages && conv.messages.length > 0) // Only conversations with messages
        .map(conv => {
          // Determine user type by checking if current user ID matches client or freelancer
          // For now, we'll default to 'client' type until proper user ID resolution is implemented
          const otherUser = conv.freelancer || conv.client;
          const otherUserType: 'client' | 'freelancer' = 'client';
          
          const lastMessage = conv.messages[conv.messages.length - 1];
          const unreadCount = conv.messages.filter(msg => 
            msg.sender_id !== user.id && !msg.read_at
          ).length;

          return {
            id: conv.id,
            otherUserName: otherUser?.full_name || 'Usuário',
            otherUserAvatar: otherUser?.avatar_url,
            otherUserType,
            lastMessage: lastMessage?.content || 'Nova conversa',
            lastMessageTime: new Date(lastMessage?.sent_at || conv.created_at).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            unreadCount,
            offerDetails: {
              service: conv.title,
              status: conv.status,
              title: conv.title
            }
          };
        });

      setConversations(processedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  return { 
    conversations, 
    loading, 
    error, 
    refetch: fetchConversations 
  };
};