
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface N8nSettings {
  webhook_url?: string;
  webhook_token?: string;
  webhook_enabled?: string;
}

export async function sendToN8n(supabaseClient: any, leadData: any) {
  // Fetch n8n configuration from settings
  const settings = await fetchN8nSettings(supabaseClient);
  
  // Check if n8n integration is enabled
  if (!settings.webhook_enabled || settings.webhook_enabled !== "true") {
    console.log('n8n integration is disabled, skipping');
    return;
  }

  // Check if webhook URL is configured
  if (!settings.webhook_url) {
    throw new Error('n8n webhook URL not configured');
  }

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // Add authorization header if token exists
  if (settings.webhook_token) {
    headers['Authorization'] = `Bearer ${settings.webhook_token}`;
  }

  // Send data to n8n webhook
  const response = await fetch(settings.webhook_url, {
    method: 'POST',
    headers,
    body: JSON.stringify(leadData)
  });

  if (!response.ok) {
    throw new Error(`n8n webhook request failed: ${response.statusText}`);
  }

  console.log('Data sent to n8n successfully', {
    url: settings.webhook_url,
    lead_id: leadData.id,
    status: response.status
  });

  return response;
}

async function fetchN8nSettings(supabaseClient: any): Promise<N8nSettings> {
  const settings: N8nSettings = {};

  // Fetch webhook URL
  const { data: webhookUrl } = await supabaseClient
    .from('settings')
    .select('valor')
    .eq('chave', 'webhook_url')
    .maybeSingle();

  if (webhookUrl) {
    settings.webhook_url = webhookUrl.valor;
  }

  // Fetch webhook token
  const { data: webhookToken } = await supabaseClient
    .from('settings')
    .select('valor')
    .eq('chave', 'webhook_token')
    .maybeSingle();

  if (webhookToken) {
    settings.webhook_token = webhookToken.valor;
  }

  // Fetch webhook enabled status
  const { data: webhookEnabled } = await supabaseClient
    .from('settings')
    .select('valor')
    .eq('chave', 'webhook_enabled')
    .maybeSingle();

  if (webhookEnabled) {
    settings.webhook_enabled = webhookEnabled.valor;
  }

  return settings;
}
