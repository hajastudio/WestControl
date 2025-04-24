
import { supabase } from "@/integrations/supabase/client";

export const webhookService = {
  testWebhook: async (webhookUrl: string, method: 'POST' | 'GET' = 'POST') => {
    const testData = {
      test: true,
      lead: {
        id: crypto.randomUUID(),
        name: "Nome do Cliente",
        email: "email@cliente.com",
        whatsapp: "5511999999999",
        cpf: "123.456.789-00",
        rg: "12.345.678-9",
        planType: "residential",
        businessType: "semi",
        cep: "01234567",
        address: {
          street: "Nome da Rua",
          number: "123",
          complement: "Apto 45",
          neighborhood: "Bairro",
          city: "Cidade",
          state: "UF",
          reference: "Próximo ao mercado"
        },
        status: "viable"
      },
      timestamp: new Date().toISOString()
    };
    
    if (method === 'GET') {
      // For GET requests, convert data to URL parameters
      const url = new URL(webhookUrl);
      
      // Add test flag
      url.searchParams.append('test', 'true');
      Object.entries(testData.lead).forEach(([key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            url.searchParams.append(`lead_${key}_${subKey}`, String(subValue));
          });
        } else {
          url.searchParams.append(`lead_${key}`, String(value));
        }
      });
      url.searchParams.append('timestamp', testData.timestamp);
      
      // Use no-cors mode to avoid CORS issues
      return fetch(url.toString(), {
        method: "GET",
        mode: "no-cors",
      });
    } else {
      // Default POST request
      return fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testData),
      });
    }
  },

  testWebhookGet: async (webhookUrl: string) => {
    return webhookService.testWebhook(webhookUrl, 'GET');
  },

  saveWebhookConfig: async (webhookUrl: string | null, isEnabled: boolean) => {
    // First, get the current configuration to obtain the correct ID
    const { data: existingConfig, error: fetchError } = await supabase
      .from('configurations')
      .select('id')
      .single();
      
    if (fetchError) {
      console.error('Error fetching configuration:', fetchError);
      throw fetchError;
    }
    
    // Use the fetched ID instead of hardcoding "1"
    return supabase
      .from('configurations')
      .update({ 
        webhook_url: isEnabled ? webhookUrl : null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', existingConfig.id);
  }
};
