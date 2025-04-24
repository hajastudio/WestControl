
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchLeadData, generateTrackingUrl } from "./lead-service.ts";
import { getWebhookConfig, sendWebhookRequest } from "./webhook-service.ts";
import { sendToN8n } from "./n8n-service.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_PROJECT_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Handle GET requests for testing
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const testMode = url.searchParams.get('test') === 'true';
      
      if (testMode) {
        console.log('Processing test GET request');
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Webhook GET test successful',
            timestamp: new Date().toISOString(),
          }),
          { 
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // Process normal POST requests
    const { leadId } = await req.json();

    // Fetch lead data and generate tracking URL
    const lead = await fetchLeadData(supabaseClient, leadId);
    const trackingUrl = generateTrackingUrl(
      Deno.env.get('SUPABASE_PROJECT_URL') || '',
      lead.id
    );

    // Prepare webhook data
    const webhookData = {
      lead: {
        ...lead,
        tracking_url: trackingUrl
      },
      timestamp: new Date().toISOString()
    };

    // Send to regular webhook if configured
    try {
      // Get webhook configuration and send request
      const webhookUrl = await getWebhookConfig(supabaseClient);
      if (webhookUrl) {
        await sendWebhookRequest(webhookUrl, webhookData);
        console.log('Standard webhook sent successfully:', {
          leadId,
          webhook_url: webhookUrl,
          status: 'success',
        });
      }
    } catch (webhookError) {
      console.error('Error sending standard webhook:', webhookError);
    }

    // Send to n8n if enabled
    try {
      await sendToN8n(supabaseClient, lead);
    } catch (n8nError) {
      console.error('Error sending to n8n:', n8nError);
    }

    return new Response(
      JSON.stringify({ success: true, tracking_url: trackingUrl }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in webhook-handler:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
