import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cep: string;
  status: string;
  created_at: string;
  updated_at: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  reference?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  plantype?: string;
  businesstype?: string;
  origem?: string;
  customer_id?: string;
  customer_status?: string;
  customer_created_at?: string;
  customer_updated_at?: string;
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          customers (
            id,
            status,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLeads = data.map(lead => ({
        ...lead,
        customer_id: lead.customers?.[0]?.id,
        customer_status: lead.customers?.[0]?.status,
        customer_created_at: lead.customers?.[0]?.created_at,
        customer_updated_at: lead.customers?.[0]?.updated_at
      }));

      setLeads(formattedLeads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar leads');
      console.error('Erro ao buscar leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads
  };
} 