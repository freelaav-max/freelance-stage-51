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

    const { offer_id, sender_id, receiver_id, content } = await req.json()

    // Insert message
    const { data: message, error: messageError } = await supabaseClient
      .from('messages')
      .insert({
        offer_id,
        sender_id,
        receiver_id,
        content,
        sent_at: new Date().toISOString()
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, email),
        receiver:profiles!messages_receiver_id_fkey(full_name, email, phone, whatsapp_notification_opt_in),
        offer:offers(title, client_id, freelancer_id)
      `)
      .single()

    if (messageError) {
      throw messageError
    }

    // Get receiver's WhatsApp opt-in status
    const { data: receiverProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('whatsapp_notification_opt_in, phone')
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
          receiver_name: message.receiver.full_name,
          content: content,
          recipient: {
            name: message.receiver.full_name,
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