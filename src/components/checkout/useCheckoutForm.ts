
import { useState } from "react";
import { FormData } from "./types";
import { formatPhone, formatCep, formatCpf } from "@/utils/cepUtils";

export const useCheckoutForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
    complement: "",
    reference: "",
    cpf: "",
    birthDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else if (name === "cep") {
      setFormData(prev => ({ ...prev, [name]: formatCep(value) }));
    } else if (name === "cpf") {
      setFormData(prev => ({ ...prev, [name]: formatCpf(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      whatsapp: "",
      cep: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      complement: "",
      reference: "",
      cpf: "",
      birthDate: "",
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
  };
};
