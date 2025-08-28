
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const offerData = await req.json();
      
      // Insert offer into database
      const { data: offer, error: offerError } = await supabaseClient
        .from('offers')
        .insert(offerData)
        .select(`
          *,
          client:profiles!offers_client_id_fkey(full_name),
          freelancer:profiles!offers_freelancer_id_fkey(phone, id)
        `)
        .single();

      if (offerError) {
        console.error('Error creating offer:', offerError);
        return new Response(
          JSON.stringify({ error: 'Failed to create offer' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if freelancer has opted in for WhatsApp notifications
      const { data: freelancerProfile } = await supabaseClient
        .from('profiles')
        .select('phone, whatsapp_notification_opt_in')
        .eq('id', offer.freelancer_id)
        .single();

      // Only send webhook if freelancer has opted in for WhatsApp notifications
      if (freelancerProfile?.whatsapp_notification_opt_in) {
        // Prepare webhook payload
        const webhookPayload = {
          offer_id: offer.id,
          freelancer_id: offer.freelancer_id,
          client_name: offer.client?.full_name || 'Cliente',
          event_title: offer.title,
          event_start_date: new Date(offer.event_date).toISOString().split('T')[0],
          event_end_date: new Date(offer.event_date).toISOString().split('T')[0], // Assuming same day for now
          offer_price: Number(offer.budget)
        };

        // Send to n8n webhook
        try {
          const webhookResponse = await fetch('https://n8n.srv967361.hstgr.cloud/webhook-test/nova-oferta', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
          });

          if (!webhookResponse.ok) {
            console.error('Webhook failed:', webhookResponse.status, await webhookResponse.text());
          } else {
            console.log('Webhook sent successfully for offer:', offer.id);
          }
        } catch (webhookError) {
          console.error('Error sending webhook to n8n:', webhookError);
        }
      }

      return new Response(
        JSON.stringify(offer),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in manage-offers function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
