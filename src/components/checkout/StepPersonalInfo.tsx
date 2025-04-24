
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronRight } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { formatPhone } from "@/utils/cepUtils";

interface StepPersonalInfoProps {
  formData: {
    name: string;
    email: string;
    whatsapp: string;
  };
  setFormData: (fn: (prev: any) => any) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setLeadId: (id: string) => void;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
  supabase: any;
}

export const StepPersonalInfo: React.FC<StepPersonalInfoProps> = ({
  formData,
  setFormData,
  setStep,
  setLeadId,
  setIsLoading,
  isLoading,
  supabase,
}) => {
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nome obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "E-mail inválido";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp obrigatório";
    else if (formData.whatsapp.replace(/\D/g, "").length < 10) newErrors.whatsapp = "WhatsApp inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "whatsapp" ? formatPhone(value) : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp.replace(/\D/g, ""),
          cep: "",
        })
        .select("id")
        .single();
      if (error) throw error;
      setLeadId(data.id);
      setStep(2);
    } catch {
      alert("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StepIndicator step={1} />
      <h3 className="text-xl font-semibold text-brand-blue mb-3">Seus Dados</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo<span className="text-red-500">*</span></Label>
          <Input id="name" name="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} className={errors.name ? "border-red-500" : ""}/>
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">E-mail<span className="text-red-500">*</span></Label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ""}/>
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp<span className="text-red-500">*</span></Label>
          <Input id="whatsapp" name="whatsapp" placeholder="(00) 00000-0000" value={formData.whatsapp} maxLength={15} onChange={handleChange} className={errors.whatsapp ? "border-red-500" : ""}/>
          {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90" disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Salvando...</> : <><ChevronRight className="mr-1" />Avançar</>}
      </Button>
    </form>
  );
};
