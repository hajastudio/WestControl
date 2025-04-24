import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "./types";

export const useLeadManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createLead = async (
    formData: FormData,
    planName: string,
    businessType: string = "residential",
  ) => {
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp.replace(/\D/g, ""),
          status: "pendente",
          cep: formData.cep || "",
          street: formData.street || "",
          number: formData.number || "",
          complement: formData.complement || "",
          neighborhood: formData.neighborhood || "",
          city: formData.city || "",
          state: formData.state || "",
          reference: formData.reference || "",
          cpf: formData.cpf || "",
          rg: formData.rg || "",
          birthDate: formData.birthDate || "",
          plantype: planName || "",
          businesstype: businessType,
          origem: localStorage.getItem("lead-origin") || undefined,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar seus dados. Tente novamente.",
      });
      return null;
    }
  };

  const updateLead = async (
    leadId: string,
    formData: FormData,
    cepViable: boolean,
  ) => {
    try {
      console.log("Atualizando lead com ID:", leadId);
      console.log("Dados do formulário:", {
        cep: formData.cep,
        street: formData.street,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        number: formData.number,
        complement: formData.complement,
        reference: formData.reference,
        cpf: formData.cpf,
        rg: formData.rg,
        birthDate: formData.birthDate,
        status: cepViable ? "aguardando_documentos" : "lista_espera"
      });

      const { data, error } = await supabase
        .from("leads")
        .update({
          cep: formData.cep.replace(/\D/g, ""),
          street: formData.street,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          number: formData.number,
          complement: formData.complement,
          reference: formData.reference,
          cpf: formData.cpf,
          rg: formData.rg,
          birthDate: formData.birthDate,
          status: cepViable ? "aguardando_documentos" : "lista_espera",
        })
        .eq("id", leadId)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Erro ao atualizar lead:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          leadId,
          formData: {
            ...formData,
            cpf: formData.cpf?.replace(/\D/g, ""),
            cep: formData.cep?.replace(/\D/g, "")
          },
          cepViable
        });
        throw error;
      }

      console.log("Lead atualizado com sucesso. Dados atualizados:", {
        id: data.id,
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        status: data.status,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        reference: data.reference,
        cpf: data.cpf,
        birthDate: data.birthDate
      });

      return data;
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      throw error;
    }
  };

  return {
    leadId,
    setLeadId,
    isLoading,
    setIsLoading,
    createLead,
    updateLead,
  };
};
