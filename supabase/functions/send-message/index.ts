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

    const { offer_id, receiver_id, content } = await req.json()

    // Verify user has permission to send messages for this offer
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
        JSON.stringify({ error: 'Unauthorized: you can only send messages for offers you are involved in' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (receiver_id !== offerCheck.client_id && receiver_id !== offerCheck.freelancer_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid receiver: receiver must be involved in the offer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert message using user's permissions
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        offer_id,
        sender_id: user.id,
        receiver_id,
        content,
        sent_at: new Date().toISOString()
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, email),
        receiver:profiles!messages_receiver_id_fkey(full_name, email),
        offer:offers(title, client_id, freelancer_id)
      `)
      .single()

    if (messageError) {
      throw messageError
    }

    // Use service role only for webhook notification check
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get receiver's WhatsApp opt-in status
    const { data: receiverProfile, error: profileError } = await serviceSupabase
      .from('profiles')
      .select('whatsapp_notification_opt_in, phone, full_name')
      .eq('id', receiver_id)
      .single()

    if (profileError) {
      console.error('Error fetching receiver profile:', profileError)
    }

    // Trigger webhook to n8n if receiver has opted in for WhatsApp notifications
    if (receiverProfile?.whatsapp_notification_opt_in && receiverProfile?.phone) {
      const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
      
      if (webhookUrl) {
        const webhookPayload = {
          type: 'new_message',
          message_id: message.id,
          offer_id: offer_id,
          offer_title: message.offer.title,
          sender_name: message.sender.full_name,
          receiver_name: receiverProfile.full_name,
          content: content,
          recipient: {
            name: receiverProfile.full_name,
            phone: receiverProfile.phone,
            email: message.receiver.email
          },
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
          // Don't throw here - we still want to return the message data
        }
      }
    }

    return new Response(
      JSON.stringify(message),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in send-message function:', error)
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