
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/utils/cepUtils";
import { Loader2 } from "lucide-react";
import { getLeadOrigin } from "@/utils/leadTracking";

interface LeadCaptureProps {
  onSubmit: (data: {
    name: string;
    email: string;
    whatsapp: string;
    planType: string;
    businessType?: string;
    origem?: string;
  }) => void;
  isLoading: boolean;
  initialData?: {
    name: string;
    email: string;
    whatsapp: string;
    planType: string;
    businessType?: string;
    origem?: string;
  };
  planData?: {
    name: string;
    speed: string;
    price: string;
  };
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  onSubmit,
  isLoading,
  initialData = {
    name: "",
    email: "",
    whatsapp: "",
    planType: "residential",
    businessType: "",
  },
  planData,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    whatsapp?: string;
  }>({});

  // On component mount, get lead origin from localStorage
  useEffect(() => {
    const origem = getLeadOrigin();
    setFormData(prev => ({ ...prev, origem }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "whatsapp") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      whatsapp?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      newErrors.whatsapp = "WhatsApp inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        planType: formData.planType || (planData ? planData.name + (planData.speed ? ` ${planData.speed}` : "") : ""),
        businessType: formData.businessType,
        origem: formData.origem || getLeadOrigin(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {planData && (
        <div className="bg-brand-blue/10 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-brand-blue mb-2">Plano Selecionado</h3>
          <div className="space-y-2">
            <p className="font-medium">{planData.name} {planData.speed}</p>
            <p className="text-xl font-bold">{planData.price}<span className="text-sm text-gray-500">/mês</span></p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo<span className="text-red-500">*</span></Label>
          <Input
            id="name"
            name="name"
            placeholder="Digite seu nome completo"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail<span className="text-red-500">*</span></Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp<span className="text-red-500">*</span></Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            placeholder="(00) 00000-0000"
            value={formData.whatsapp}
            onChange={handleChange}
            className={errors.whatsapp ? "border-red-500" : ""}
            maxLength={15}
          />
          {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#db451c] hover:bg-[#db451c]/90 text-white py-3 rounded-md font-medium transition-colors flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            "Avançar"
          )}
        </button>
      </div>
    </form>
  );
};
