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
    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { offer_id, status, rejection_reason, counter_price } = await req.json()

    // First verify user has permission to update this offer
    const { data: offerCheck, error: checkError } = await supabase
      .from('offers')
      .select('client_id, freelancer_id')
      .eq('id', offer_id)
      .single()

    if (checkError || !offerCheck) {
      return new Response(
        JSON.stringify({ error: 'Offer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (offerCheck.client_id !== user.id && offerCheck.freelancer_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: you can only update offers you are involved in' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update offer status using user's permissions
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .update({ 
        status,
        rejection_reason,
        counter_price,
        updated_at: new Date().toISOString()
      })
      .eq('id', offer_id)
      .select(`
        *,
        client:profiles!offers_client_id_fkey(full_name, email),
        freelancer:profiles!offers_freelancer_id_fkey(full_name, email)
      `)
      .single()

    if (offerError) {
      throw offerError
    }

    // Use service role only for webhook notification check
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Determine who should receive the notification (the other party)
    const isClientAction = offer.client_id === user.id
    const recipientId = isClientAction ? offer.freelancer_id : offer.client_id

    // Get recipient's notification preferences
    const { data: notificationTarget, error: targetError } = await serviceSupabase
      .from('profiles')
      .select('full_name, email, phone, whatsapp_notification_opt_in')
      .eq('id', recipientId)
      .single()

    if (targetError) {
      console.error('Error fetching notification target:', targetError)
    }

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