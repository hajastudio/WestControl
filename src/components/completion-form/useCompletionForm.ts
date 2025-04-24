
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadContext } from "@/context/LeadContext";
import { useToast } from "@/hooks/use-toast";
import { formatPhone } from "@/utils/cepUtils";

export function useCompletionForm() {
  const { leadData, updateLeadData } = useLeadContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step: 1=contato; 2=endereço; 3=pessoal; 4=confirmação
  const [step, setStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lead (contato)
  const [leadForm, setLeadForm] = useState({
    name: leadData.name || "",
    email: leadData.email || "",
    whatsapp: leadData.whatsapp || "",
  });

  // Endereço
  const [addressData, setAddressData] = useState({
    number: leadData.number || "",
    complement: leadData.complement || "",
    reference: leadData.reference || "",
  });

  // Dados pessoais
  const [personalData, setPersonalData] = useState({
    cpf: leadData.cpf || "",
    rg: leadData.rg || "",
    birthDate: leadData.birthDate || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    whatsapp: "",
    number: "",
    complement: "",
    reference: "",
    cpf: "",
    rg: "",
    birthDate: "",
  });

  // Redireciona caso não tenha dados do endereço
  useEffect(() => {
    if (
      !leadData.street ||
      !leadData.neighborhood ||
      !leadData.city ||
      !leadData.state ||
      !leadData.cep
    ) {
      toast({
        title: "Informação incompleta",
        description: "Por favor, complete a verificação de viabilidade primeiro.",
        variant: "destructive",
      });
      navigate("/viability");
    }
  }, [leadData, navigate, toast]);

  // HANDLERS

  // Step 1: Name, Email, WhatsApp
  const handleLeadFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      setLeadForm((prev) => ({
        ...prev,
        whatsapp: formatPhone(value),
      }));
    } else {
      setLeadForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateLeadForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    if (!leadForm.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    }
    if (!leadForm.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(leadForm.email)) {
      newErrors.email = "E-mail inválido";
      isValid = false;
    }
    if (!leadForm.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
      isValid = false;
    } else if (leadForm.whatsapp.replace(/\D/g, "").length < 10) {
      newErrors.whatsapp = "WhatsApp inválido";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLeadForm()) {
      updateLeadData({
        name: leadForm.name,
        email: leadForm.email,
        whatsapp: leadForm.whatsapp,
      });
      setStep(2);
    }
  };

  // Step 2: Address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "number") {
      setErrors((prev) => ({
        ...prev,
        number: "",
      }));
    }
  };

  const validateAddressForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    if (!addressData.number.trim()) {
      newErrors.number = "Número é obrigatório";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddressForm()) {
      updateLeadData(addressData);
      setStep(3);
    }
  };

  // Step 3: Dados pessoais (cpf, rg, nascimento)
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      // Formata CPF
      const digits = value.replace(/\D/g, "");
      let formattedCpf = digits;
      if (digits.length > 3) {
        formattedCpf = `${digits.slice(0, 3)}.${digits.slice(3)}`;
      }
      if (digits.length > 6) {
        formattedCpf = `${formattedCpf.slice(0, 7)}.${formattedCpf.slice(7)}`;
      }
      if (digits.length > 9) {
        formattedCpf = `${formattedCpf.slice(0, 11)}-${formattedCpf.slice(11, 13)}`;
      }
      setPersonalData((prev) => ({
        ...prev,
        cpf: formattedCpf,
      }));
    } else if (name === "birthDate") {
      // Formata data como dd/mm/aaaa
      const digits = value.replace(/\D/g, "");
      let formattedDate = digits;
      if (digits.length > 2) {
        formattedDate = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }
      if (digits.length > 4) {
        formattedDate = `${formattedDate.slice(0, 5)}/${formattedDate.slice(5, 9)}`;
      }
      setPersonalData((prev) => ({
        ...prev,
        birthDate: formattedDate,
      }));
    } else {
      setPersonalData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validatePersonalForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    if (!personalData.cpf.trim() || personalData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
      isValid = false;
    }
    if (!personalData.rg.trim()) {
      newErrors.rg = "RG é obrigatório";
      isValid = false;
    }
    if (!personalData.birthDate.trim() || personalData.birthDate.length !== 10) {
      newErrors.birthDate = "Data de nascimento inválida";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePersonalForm()) {
      updateLeadData({
        cpf: personalData.cpf,
        rg: personalData.rg,
        birthDate: personalData.birthDate,
      });
      setStep(4);
    }
  };

  // Step 4: Confirmação/finalização
  useEffect(() => {
    // Se step 4: adicionar listener para botão submit do SummaryStep
    const handler = (e: Event) => {
      if (step === 4 && (e.target as HTMLElement).id === "finaliza-cadastro") {
        e.preventDefault();
        handleSummarySubmit();
      }
    };
    document.addEventListener("submit", handler as EventListener, true);
    return () => document.removeEventListener("submit", handler as EventListener, true);
    // eslint-disable-next-line
  }, [step, leadData, addressData, personalData]);

  const handleSummarySubmit = async () => {
    setIsSubmitting(true);
    try {
      updateLeadData({
        name: leadForm.name,
        email: leadForm.email,
        whatsapp: leadForm.whatsapp,
        ...addressData,
        ...personalData,
      });
      toast({
        title: "Sucesso!",
        description: "Cadastro concluído com sucesso.",
      });
      navigate("/success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    leadData: { ...leadData, ...leadForm },
    addressData,
    personalData,
    errors,
    handleLeadFormChange,
    handleAddressChange,
    handlePersonalChange,
    handleLeadSubmit,
    handleAddressSubmit,
    handlePersonalSubmit,
    isSubmitting,
  };
}
