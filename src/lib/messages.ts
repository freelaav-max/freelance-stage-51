import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export interface NewMessageData {
  offer_id: string;
  receiver_id: string;
  content: string;
}

export const sendMessage = async (messageData: NewMessageData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Use a edge function to send message and trigger webhook
  const { data, error } = await supabase.functions.invoke('send-message', {
    body: {
      ...messageData,
      sender_id: user.id,
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const getMessages = async (offerId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
      receiver:profiles!messages_receiver_id_fkey(full_name, avatar_url)
    `)
    .eq('offer_id', offerId)
    .order('sent_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const markMessageAsRead = async (messageId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ 
      read_at: new Date().toISOString() 
    })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      id,
      title,
      status,
      created_at,
      client:profiles!offers_client_id_fkey(full_name, avatar_url),
      freelancer:profiles!offers_freelancer_id_fkey(full_name, avatar_url),
      messages(
        id,
        content,
        sent_at,
        read_at,
        sender_id
      )
    `)
    .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};