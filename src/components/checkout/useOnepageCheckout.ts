
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CheckoutProps } from "./types";
import { useCheckoutForm } from "./useCheckoutForm";
import { useAddressValidation } from "./useAddressValidation";
import { useLeadManagement } from "./useLeadManagement";
import { usePlanUpgrade } from "./hooks/usePlanUpgrade";
import { useCheckoutStep } from "./hooks/useCheckoutStep";
import { useCheckoutSubmission } from "./hooks/useCheckoutSubmission";
import { supabase } from "@/integrations/supabase/client";

export const useOnepageCheckout = ({
  plan,
  onClose,
  businessType = "residential",
}: CheckoutProps) => {
  const { toast } = useToast();
  const { step, setStep } = useCheckoutStep();
  const { upgradedPlan, handleUpgrade } = usePlanUpgrade();
  const { formData, setFormData, handleInputChange, resetForm } = useCheckoutForm();
  
  // Move useLeadManagement before useAddressValidation to fix the TS2448 error
  const { 
    leadId, 
    setLeadId, 
    isLoading, 
    setIsLoading, 
    createLead, 
    updateLead 
  } = useLeadManagement();
  
  // Now leadId is defined before being used as a parameter
  const { 
    cepChecking, 
    cepError, 
    cepViable, 
    setCepViable, 
    fetchAddress, 
    handleCepBlur 
  } = useAddressValidation(setFormData, leadId);

  const { handleFinalizarCadastro, handleJoinWaitlist } = useCheckoutSubmission(
    leadId,
    setIsLoading,
    onClose,
    resetForm,
    setLeadId,
    setCepViable,
    formData,
    cepViable
  );

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!leadId) {
        const newLeadId = await createLead(formData, plan.name, businessType);
        if (newLeadId) {
          setLeadId(newLeadId);
          setStep(2);
          toast({
            title: "Dados salvos com sucesso!",
            description: "Agora vamos verificar seu endereço.",
          });
        }
      } else {
        await updateLeadData({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
        });
        setStep(2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadData = async (stepData: Partial<typeof formData>) => {
    if (!leadId) return;

    setIsLoading(true);
    try {
      await updateLead(leadId, { ...formData, ...stepData }, cepViable as boolean);
      toast({
        title: "Dados salvos!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar seus dados. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadId) {
      await updateLeadData({
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        reference: formData.reference,
      });
      setStep(3);
    }
  };

  const handlePersonalSubmit = async () => {
    if (leadId) {
      setIsLoading(true);
      try {
        const updateData = {
          cpf: formData.cpf,
          birthDate: formData.birthDate,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          reference: formData.reference
        };

        const { error } = await supabase
          .from('leads')
          .update(updateData)
          .eq('id', leadId);

        if (error) throw error;
        setStep(5);
        
        toast({
          title: "Dados salvos!",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Houve um problema ao salvar seus dados. Tente novamente.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpgradeClick = () => {
    handleUpgrade(plan);
    setStep(4);
  };

  const handleSkipUpgrade = () => {
    setStep(4);
  };

  return {
    plan,
    step,
    setStep,
    isLoading,
    formData,
    setFormData,
    cepChecking,
    cepError,
    cepViable,
    upgradedPlan,
    handleInputChange,
    handleStep1Submit,
    handleAddressSubmit,
    handlePersonalSubmit,
    fetchAddress,
    handleCepBlur,
    handleFinalizarCadastro,
    handleJoinWaitlist,
    handleUpgrade: handleUpgradeClick,
    handleSkipUpgrade,
    onClose,
  };
};
