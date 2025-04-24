
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types and Interfaces
export interface PlanData {
  name: string;
  speed: string;
  price: string;
  businessType?: "residential" | "semi" | "dedicated";
}

export interface LeadData {
  name: string;
  email: string;
  whatsapp: string;
  planType: string;
  businessType: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  reference: string;
  cpf: string;
  rg: string;
  birthDate: string;
}

export interface NotificationState {
  show: boolean;
  title: string;
  description: string;
  type: "success" | "error" | "info" | "warning";
}

export const useViabilityStepper = (initialLeadData?: LeadData) => {
  // State management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [leadData, setLeadData] = useState<LeadData>(initialLeadData || {} as LeadData);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cepIsViable, setCepIsViable] = useState<boolean | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    title: "",
    description: "",
    type: "info",
  });

  // Notification handler
  const showNotification = (title: string, description: string, type: NotificationState["type"]) => {
    setNotification({
      show: true,
      title,
      description,
      type,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  // Lead capture handler
  const handleLeadCapture = async (data: {
    name: string;
    email: string;
    whatsapp: string;
    planType: string;
    businessType?: string;
  }) => {
    setIsLoading(true);
    
    try {
      // Update lead data
      setLeadData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        planType: data.planType,
        businessType: data.businessType || "",
      }));
      
      if (data.planType) {
        // Set plan data based on selected plan type
        setPlanData({
          name: `Plano ${data.planType.charAt(0).toUpperCase() + data.planType.slice(1)}`,
          speed: data.planType === "residential" ? "100 Mbps" : "300 Mbps",
          price: data.planType === "residential" ? "R$ 99,90" : "R$ 199,90",
          businessType: data.businessType as "residential" | "semi" | "dedicated" | undefined,
        });
      }
      
      // Move to next step
      setCurrentStep(2);
      
    } catch (error) {
      console.error("Error in lead capture:", error);
      showNotification("Erro", "Ocorreu um erro ao capturar seus dados. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // CEP check handler
  const handleCepCheck = async (
    cep: string, 
    isViable: boolean, 
    addressData?: {
      street: string;
      neighborhood: string;
      city: string;
      state: string;
    }
  ) => {
    setIsLoading(true);
    
    try {
      setCepIsViable(isViable);
      
      // Update lead data with address information
      setLeadData((prev) => ({
        ...prev,
        cep,
        street: addressData?.street || "",
        neighborhood: addressData?.neighborhood || "",
        city: addressData?.city || "",
        state: addressData?.state || "",
      }));
      
      // Move to next step
      setCurrentStep(3);
      
      if (isViable) {
        showNotification(
          "Ótimas notícias!", 
          "Nossos serviços estão disponíveis em sua região. Complete seu cadastro para prosseguir.", 
          "success"
        );
      } else {
        showNotification(
          "Cobertura indisponível", 
          "Infelizmente, ainda não temos cobertura na sua região. Entre para nossa lista de espera e será notificado.", 
          "info"
        );
      }
      
    } catch (error) {
      console.error("Error in CEP check:", error);
      showNotification("Erro", "Ocorreu um erro ao verificar o CEP. Tente novamente.", "error");
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Address submission handler
  const handleAddressSubmit = async (data: {
    number: string;
    complement: string;
    reference: string;
    cpf: string;
    rg: string;
    birthDate: string;
  }) => {
    setIsLoading(true);
    
    try {
      // Update lead data with additional information
      const updatedLeadData = {
        ...leadData,
        number: data.number,
        complement: data.complement || "",
        reference: data.reference || "",
        cpf: data.cpf,
        rg: data.rg,
        birthDate: data.birthDate,
      };
      
      setLeadData(updatedLeadData);
      
      // Save lead to database
      const { error } = await supabase.from("leads").insert({
        name: updatedLeadData.name,
        email: updatedLeadData.email,
        whatsapp: updatedLeadData.whatsapp,
        cep: updatedLeadData.cep,
        street: updatedLeadData.street,
        number: updatedLeadData.number,
        complement: updatedLeadData.complement,
        neighborhood: updatedLeadData.neighborhood,
        city: updatedLeadData.city,
        state: updatedLeadData.state,
        reference: updatedLeadData.reference,
        cpf: updatedLeadData.cpf,
        rg: updatedLeadData.rg,
        birthdate: updatedLeadData.birthDate,
        plantype: updatedLeadData.planType,
        businesstype: updatedLeadData.businessType,
        origem: "viability-check",
      });
      
      if (error) throw error;
      
      // Success notification and redirect to thank you page
      showNotification(
        "Sucesso!", 
        "Seus dados foram registrados com sucesso! Nossa equipe entrará em contato em breve.", 
        "success"
      );
      
      // Reset to step 1 for a new lead after a short delay
      setTimeout(() => {
        setCurrentStep(1);
        setLeadData({} as LeadData);
        setPlanData(null);
        setCepIsViable(null);
      }, 5000);
      
    } catch (error) {
      console.error("Error in address submission:", error);
      showNotification("Erro", "Ocorreu um erro ao salvar seus dados. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Waitlist join handler
  const handleWaitlistJoin = async () => {
    setIsLoading(true);
    
    try {
      // Save lead to database with waitlist status
      const { error } = await supabase.from("leads").insert({
        name: leadData.name,
        email: leadData.email,
        whatsapp: leadData.whatsapp,
        cep: leadData.cep,
        street: leadData.street,
        neighborhood: leadData.neighborhood,
        city: leadData.city,
        state: leadData.state,
        plantype: leadData.planType,
        businesstype: leadData.businessType,
        origem: "waitlist",
        status: "waitlist",
      });
      
      if (error) throw error;
      
      showNotification(
        "Lista de espera", 
        "Você foi adicionado à nossa lista de espera! Entraremos em contato assim que tivermos cobertura na sua região.", 
        "success"
      );
      
      // Reset to step 1 for a new lead after a short delay
      setTimeout(() => {
        setCurrentStep(1);
        setLeadData({} as LeadData);
        setPlanData(null);
        setCepIsViable(null);
      }, 5000);
      
    } catch (error) {
      console.error("Error joining waitlist:", error);
      showNotification("Erro", "Ocorreu um erro ao entrar na lista de espera. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Return hook data and functions
  return {
    currentStep,
    leadData,
    planData,
    isLoading,
    cepIsViable,
    notification,
    hideNotification,
    handleLeadCapture,
    handleCepCheck,
    handleAddressSubmit,
    handleWaitlistJoin,
  };
};
