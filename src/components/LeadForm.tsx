import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeadContext } from "@/context/LeadContext";
import { formatPhone } from "@/utils/cepUtils";
import { useNavigate } from "react-router-dom";
import { trackLeadOrigin, getLeadOrigin } from "@/utils/leadTracking";

interface LeadFormProps {
  planType: "residential" | "business";
}

export function LeadForm({ planType }: LeadFormProps) {
  const { updateLeadData } = useLeadContext();
  const navigate = useNavigate();
  
  // Track origin when component mounts
  useEffect(() => {
    trackLeadOrigin();
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "whatsapp") {
      setFormData({
        ...formData,
        [name]: formatPhone(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user types
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
      isValid = false;
    }
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
      isValid = false;
    } else if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      newErrors.whatsapp = "WhatsApp inválido";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Get tracked origin from localStorage
      const origem = getLeadOrigin();
      
      // Save data to context with the origin
      updateLeadData({
        ...formData,
        planType,
        origem,
        businessType: planType === "business" ? "semi" : undefined,
      });
      
      // Proceed to next step
      navigate("/viability");
    }
  };

  return (
    <div className="py-12 bg-brand-gray/30">
      <Container>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {planType === "residential" ? "Internet Para Você" : "Internet Para Seu Negócio"}
            </h2>
            <p className="text-gray-600">
              Preencha seus dados para verificarmos a disponibilidade na sua região
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className={errors.whatsapp ? "border-red-500" : ""}
              />
              {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}
            </div>
            
            {planType === "business" && (
              <div className="p-4 bg-brand-gray/30 rounded-lg">
                <p className="font-medium mb-2">Selecione o tipo de conexão:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="semi"
                      name="businessType"
                      value="semi"
                      className="w-4 h-4 text-brand-blue"
                      onChange={() => updateLeadData({ businessType: "semi" })}
                      defaultChecked
                    />
                    <Label htmlFor="semi" className="cursor-pointer">Semi Dedicado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="dedicated"
                      name="businessType"
                      value="dedicated"
                      className="w-4 h-4 text-brand-blue"
                      onChange={() => updateLeadData({ businessType: "dedicated" })}
                    />
                    <Label htmlFor="dedicated" className="cursor-pointer">Dedicado</Label>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-lg py-6"
            >
              Verificar Disponibilidade
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default LeadForm;
