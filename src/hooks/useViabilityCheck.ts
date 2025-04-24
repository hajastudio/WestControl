
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "@/types/viability";
import { formatCep, formatPhone } from "@/utils/cepUtils";

export const useViabilityCheck = (selectedPlan: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isViable, setIsViable] = useState<boolean | null>(null);
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [error, setError] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    cep: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "cep") {
      setFormData({ ...formData, [name]: formatCep(value) });
    } else if (name === "whatsapp") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const checkCepViability = async (cep: string) => {
    setIsLoading(true);
    setAddressLoaded(false);
    setError("");

    try {
      const normalizedCep = cep.replace(/\D/g, "");
      
      const { data, error } = await supabase
        .from("viability")
        .select("*")
        .eq("cep", normalizedCep)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsViable(data.is_viable);
        
        if (data.is_viable) {
          const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);
          const addressData = await response.json();
          
          if (!addressData.erro) {
            setFormData(prev => ({
              ...prev,
              street: addressData.logradouro,
              neighborhood: addressData.bairro,
              city: addressData.localidade,
              state: addressData.uf
            }));
            setAddressLoaded(true);
          }
        }
      } else {
        setIsViable(false);
      }
    } catch (error) {
      console.error("Error checking viability:", error);
      setError("Ocorreu um erro ao verificar a viabilidade. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveLeadData = async () => {
    if (leadSaved) return true;
    
    try {
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp.replace(/\D/g, ""),
          cep: formData.cep.replace(/\D/g, ""),
          planType: selectedPlan,
          status: isViable === true ? 'viable' : isViable === false ? 'not_viable' : 'pending',
          origem: localStorage.getItem("lead-origin") || undefined,
        });

      if (leadError) throw leadError;
      
      setLeadSaved(true);
      return true;
    } catch (error) {
      console.error("Error saving lead:", error);
      setError("Ocorreu um erro ao salvar suas informações. Por favor, tente novamente.");
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Salva as informações do lead
      const saveSuccess = await saveLeadData();
      
      if (!saveSuccess) return;

      toast({
        title: "Sucesso!",
        description: "Suas informações foram salvas com sucesso.",
      });

      // Redireciona com base na viabilidade
      if (isViable) {
        navigate("/completion");
      } else {
        navigate("/waitlist");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setError("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.cep && formData.cep.replace(/\D/g, "").length === 8) {
      checkCepViability(formData.cep);
    }
  }, [formData.cep]);

  return {
    formData,
    isLoading,
    isViable,
    addressLoaded,
    error,
    handleInputChange,
    handleSubmit
  };
};
