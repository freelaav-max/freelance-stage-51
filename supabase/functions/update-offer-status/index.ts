import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { offer_id, user_id, status, rejection_reason, counter_price } = await req.json()

    // Update offer status
    const { data: offer, error: offerError } = await supabaseClient
      .from('offers')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', offer_id)
      .select(`
        *,
        client:profiles!offers_client_id_fkey(full_name, email, phone, whatsapp_notification_opt_in),
        freelancer:profiles!offers_freelancer_id_fkey(full_name, email, phone, whatsapp_notification_opt_in)
      `)
      .single()

    if (offerError) {
      throw offerError
    }

    // Determine who should receive the notification (the other party)
    const isClientAction = offer.client_id === user_id
    const notificationTarget = isClientAction ? offer.freelancer : offer.client

    // Trigger webhook to n8n if user has opted in for WhatsApp notifications
    if (notificationTarget?.whatsapp_notification_opt_in && notificationTarget?.phone) {
      const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
      
      if (webhookUrl) {
        const webhookPayload = {
          type: 'offer_status_updated',
          offer_id: offer.id,
          offer_title: offer.title,
          status: status,
          rejection_reason: rejection_reason || null,
          counter_price: counter_price || null,
          client_name: offer.client.full_name,
          freelancer_name: offer.freelancer.full_name,
          recipient: {
            name: notificationTarget.full_name,
            phone: notificationTarget.phone,
            email: notificationTarget.email
          },
          action_by: isClientAction ? 'client' : 'freelancer',
          timestamp: new Date().toISOString()
        }

        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
          })

          if (!webhookResponse.ok) {
            console.error('Webhook failed:', await webhookResponse.text())
          }
        } catch (webhookError) {
          console.error('Error calling webhook:', webhookError)
          // Don't throw here - we still want to return the offer data
        }
      }
    }

    return new Response(
      JSON.stringify(offer),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in update-offer-status function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})