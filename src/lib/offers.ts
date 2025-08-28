
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Offer = Database['public']['Tables']['offers']['Row'];
export type OfferInsert = Database['public']['Tables']['offers']['Insert'];

export interface CreateOfferData {
  freelancer_id: string;
  specialty: Database['public']['Enums']['specialty'];
  title: string;
  description: string;
  event_date: string;
  event_time?: string;
  location: string;
  duration?: number;
  budget: number;
}

export const createOffer = async (offerData: CreateOfferData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const payload = {
    ...offerData,
    client_id: user.id,
  };

  // Use the manage-offers edge function to create the offer and trigger webhook
  const { data, error } = await supabase.functions.invoke('manage-offers', {
    body: payload
  });

  if (error) {
    throw error;
  }

  return data;
};

export const getOffers = async (userId: string) => {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      client:profiles!offers_client_id_fkey(full_name, email),
      freelancer:profiles!offers_freelancer_id_fkey(full_name, phone)
    `)
    .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export interface UpdateOfferStatusData {
  status: 'accepted' | 'rejected' | 'counter_offer';
  rejection_reason?: string;
  counter_price?: number;
}

export const updateOfferStatus = async (
  offerId: string, 
  statusData: UpdateOfferStatusData
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Use a edge function to update offer status and trigger webhook
  const { data, error } = await supabase.functions.invoke('update-offer-status', {
    body: {
      offer_id: offerId,
      user_id: user.id,
      ...statusData
    }
  });

  if (error) {
    throw error;
  }

  return data;
};
