
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "./types";
import { useToast } from "@/hooks/use-toast";
import { formatCep, normalizeCep } from "@/utils/cepUtils";

export const useAddressValidation = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  leadId?: string | null
) => {
  const { toast } = useToast();
  const [cepChecking, setCepChecking] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [cepViable, setCepViable] = useState<boolean | null>(null);

  const fetchAddress = async (cep: string) => {
    setCepChecking(true);
    setCepError(null);
    const normalizedCep = cep.replace(/\D/g, "");
    if (normalizedCep.length !== 8) {
      setCepError("CEP inválido. Use o formato 00000-000");
      setCepChecking(false);
      return;
    }
    
    try {
      // First try to fetch from our coverage_areas table
      const { data: coverageData, error: coverageError } = await supabase
        .from("coverage_areas")
        .select("*")
        .eq("cep", normalizedCep)
        .maybeSingle();
      
      // If we have the CEP in our database
      if (coverageData && !coverageError) {
        const addressData = {
          cep: formatCep(normalizedCep), // Importante: formatar o CEP aqui
          street: coverageData.rua || "",
          neighborhood: coverageData.bairro || "",
          city: coverageData.cidade || "",
          state: coverageData.estado || "",
        };

        setFormData(prev => ({
          ...prev,
          ...addressData
        }));

        // Save the address data if we have a leadId
        if (leadId) {
          console.log("Salvando endereço para lead:", leadId, addressData);
          const { error: updateError } = await supabase
            .from("leads")
            .update({
              ...addressData,
              cep: normalizedCep, // Normalizar o CEP para salvar no banco
            })
            .eq("id", leadId);

          if (updateError) {
            console.error("Erro ao atualizar lead:", updateError);
            toast({
              variant: "destructive",
              title: "Erro ao salvar",
              description: "Houve um problema ao salvar o endereço. Tente novamente.",
            });
          } else {
            toast({
              title: "Endereço salvo!",
              description: "O endereço foi atualizado com sucesso.",
            });
          }
        }
        
        // Check viability
        const { data: viabilityData } = await supabase
          .from("viability")
          .select("is_viable")
          .eq("cep", normalizedCep)
          .maybeSingle();
          
        setCepViable(viabilityData?.is_viable === true);
        setCepChecking(false);
        return;
      }

      // If not in our database, check with ViaCEP
      const resp = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);
      const address = await resp.json();
      if (address.erro) {
        setCepError("CEP não encontrado.");
        setCepChecking(false);
        setFormData(prev => ({
          ...prev,
          street: "",
          neighborhood: "",
          city: "",
          state: "",
        }));
        return;
      }
      
      const addressData = {
        cep: formatCep(normalizedCep), // Importante: formatar o CEP aqui
        street: address.logradouro || "",
        neighborhood: address.bairro || "",
        city: address.localidade || "",
        state: address.uf || "",
      };

      setFormData(prev => ({
        ...prev,
        ...addressData
      }));

      // Save the address data if we have a leadId
      if (leadId) {
        console.log("Salvando endereço do ViaCEP para lead:", leadId, addressData);
        const { error: updateError } = await supabase
          .from("leads")
          .update({
            ...addressData,
            cep: normalizedCep, // Normalizar o CEP para salvar no banco
          })
          .eq("id", leadId);

        if (updateError) {
          console.error("Erro ao atualizar lead:", updateError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "Houve um problema ao salvar o endereço. Tente novamente.",
          });
        } else {
          toast({
            title: "Endereço salvo!",
            description: "O endereço foi atualizado com sucesso.",
          });
        }
      }
      
      // Simulate viability check or check with our viability table
      const { data: viabilityData } = await supabase
        .from("viability")
        .select("is_viable")
        .eq("cep", normalizedCep)
        .maybeSingle();
        
      if (viabilityData) {
        setCepViable(viabilityData.is_viable);
      } else {
        // If CEP is not in our viability table, we can simulate a viability check
        const randomViable = Math.random() > 0.3;
        setCepViable(randomViable);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setCepError("Erro ao buscar o endereço.");
    } finally {
      setCepChecking(false);
    }
  };

  const handleCepBlur = async (cep: string) => {
    if (cep.replace(/\D/g, "").length === 8) {
      await fetchAddress(cep);
    }
  };

  return {
    cepChecking,
    cepError,
    cepViable,
    setCepViable,
    fetchAddress,
    handleCepBlur,
  };
};
