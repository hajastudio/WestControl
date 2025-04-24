import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const getWebhookConfig = async (supabaseClient: any) => {
  const { data: config, error: configError } = await supabaseClient
    .from('configurations')
    .select('webhook_url')
    .single();

  if (configError) throw configError;
  if (!config.webhook_url) {
    throw new Error('Webhook URL not configured');
  }

  return config.webhook_url;
};

export const sendWebhookRequest = async (webhookUrl: string, webhookData: any) => {
  // Check if the URL has a parameter that indicates it should be a GET request
  if (webhookUrl.includes('method=get')) {
    // Convert webhook data to query parameters
    const url = new URL(webhookUrl);
    Object.entries(flattenObject(webhookData)).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const webhookResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook GET request failed: ${webhookResponse.statusText}`);
    }

    return webhookResponse;
  } else {
    // Default to POST request with enhanced data
    const formattedData = {
      ...webhookData,
      metadata: {
        timestamp: new Date().toISOString(),
        event: 'lead.viable',
        version: '1.0'
      }
    };

    console.log('Sending webhook POST request:', {
      url: webhookUrl,
      data: formattedData
    });

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook POST request failed: ${webhookResponse.statusText}`);
    }

    return webhookResponse;
  }
};

// Helper function to flatten nested objects for query parameters
function flattenObject(obj: any, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Record<string, any>);
}
