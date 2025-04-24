import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cpf: string;
  rg: string | null;
  birth_date: string | null;
  cep: string;
  street: string;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  reference: string | null;
  plan_type: string | null;
  business_type: string | null;
  status: string;
  lead_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const updateCustomerStatus = async (customerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (error) throw error;
      await fetchCustomers();
    } catch (err) {
      console.error('Error updating customer status:', err);
      throw err;
    }
  };

  const updateCustomerPlan = async (customerId: string, planType: string, businessType: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ 
          plan_type: planType,
          business_type: businessType,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (error) throw error;
      await fetchCustomers();
    } catch (err) {
      console.error('Error updating customer plan:', err);
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    updateCustomerStatus,
    updateCustomerPlan
  };
}; 