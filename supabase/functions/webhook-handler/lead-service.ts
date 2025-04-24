
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cpf: string;
  rg: string;
  planType: string;
  businessType: string;
  cep: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    reference: string;
  };
  status: string;
}

export const fetchLeadData = async (supabaseClient: any, leadId: string): Promise<Lead> => {
  const { data: lead, error: leadError } = await supabaseClient
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .maybeSingle();

  if (leadError) throw leadError;
  if (!lead) throw new Error('Lead not found');

  return lead;
};

export const generateTrackingUrl = (projectUrl: string, leadId: string): string => {
  const trackingPath = `/dashboard?id=${leadId}`;
  return `${projectUrl.replace('.supabase.co', '.lovable.app')}${trackingPath}`;
};

