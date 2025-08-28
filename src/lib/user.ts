
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export const getUserById = async (userId: string) => {
  // Use the get-user edge function to fetch user data with phone and WhatsApp preferences
  const { data, error } = await supabase.functions.invoke('get-user', {
    body: { userId }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const updateWhatsAppOptIn = async (optIn: boolean, phone?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const updates: Partial<UserProfile> = {
    whatsapp_notification_opt_in: optIn,
    updated_at: new Date().toISOString()
  };

  if (phone) {
    updates.phone = phone;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWhatsAppOptInStatus = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { hasOptedIn: false, userPhone: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('whatsapp_notification_opt_in, phone')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching WhatsApp opt-in status:', error);
    return { hasOptedIn: false, userPhone: null };
  }

  return {
    hasOptedIn: data.whatsapp_notification_opt_in || false,
    userPhone: data.phone || null
  };
};
