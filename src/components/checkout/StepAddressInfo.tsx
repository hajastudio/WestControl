
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft, Check } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { formatCpf } from "@/utils/cepUtils";

interface StepAddressInfoProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
  leadId: string | null;
  supabase: any;
  successMsg: string;
  setSuccessMsg: (val: string) => void;
  setCepViable: (v: boolean | null) => void;
  setLeadId: (id: string | null) => void;
}

export const StepAddressInfo: React.FC<StepAddressInfoProps> = ({
  formData,
  setFormData,
  setStep,
  setIsLoading,
  isLoading,
  leadId,
  supabase,
  successMsg,
  setSuccessMsg,
  setCepViable,
  setLeadId,
}) => {
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.number.trim()) newErrors.number = "Número obrigatório";
    if (!formData.cpf.trim() || formData.cpf.replace(/\D/g, "").length !== 11) newErrors.cpf = "CPF inválido";
    if (!formData.rg.trim()) newErrors.rg = "RG obrigatório";
    if (!formData.birthDate.trim()) newErrors.birthDate = "Data de nascimento obrigatória";
    else {
      const parts = formData.birthDate.split("/");
      if (parts.length !== 3 || parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 4) {
        newErrors.birthDate = "Data inválida (DD/MM/AAAA)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "cpf"
          ? formatCpf(value)
          : name === "birthDate"
          ? value.replace(/[^0-9/]/g, "").slice(0, 10)
          : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      if (!leadId) {
        setIsLoading(false);
        return;
      }
      await supabase.from("leads").update({
        street: formData.street,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        number: formData.number,
        complement: formData.complement,
        reference: formData.reference,
        cpf: formData.cpf.replace(/\D/g, ""),
        rg: formData.rg,
        birthDate: formData.birthDate,
        status: "aguardando_documentos",
      }).eq("id", leadId);
      setSuccessMsg("Seu cadastro foi finalizado com sucesso! Entraremos em contato.");
    } catch {
      alert("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Check className="text-green-600 w-12 h-12 mb-4" />
        <p className="text-green-800 text-lg font-semibold mb-2">{successMsg}</p>
        <Button className="mt-4" onClick={() => {
          setStep(1); setFormData((prev:any)=>({ ...prev, name:"", email:"", whatsapp:"", cep:"", street:"", neighborhood:"", city:"", state:"", number:"", complement:"", reference:"", cpf:"", rg:"", birthDate:"" })); setSuccessMsg("");
          setCepViable(null); setLeadId(null);
        }}>Nova solicitação</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <StepIndicator step={3} />
      <h3 className="text-xl font-semibold text-brand-blue mb-2">Endereço e Dados pessoais</h3>
      <div className="bg-brand-gray/20 p-4 rounded-lg mb-2">
        <p className="font-semibold text-sm mb-1">
          {formData.street && (
            <>
              {formData.street}
              {formData.number ? `, Nº ${formData.number}` : ""}
            </>
          )}
        </p>
        <p className="text-sm">
          {formData.neighborhood && `${formData.neighborhood} - `}
          {formData.city && `${formData.city}`}
          {formData.state && ` / ${formData.state}`}
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="number">Número<span className="text-red-500">*</span></Label>
          <Input id="number" name="number" placeholder="123" value={formData.number} onChange={handleChange} className={errors.number ? "border-red-500" : ""}/>
          {errors.number && <p className="text-red-500 text-xs">{errors.number}</p>}
        </div>
        <div>
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" placeholder="Apto, etc." value={formData.complement} onChange={handleChange}/>
        </div>
        <div>
          <Label htmlFor="reference">Referência</Label>
          <Input id="reference" name="reference" placeholder="Próx..." value={formData.reference} onChange={handleChange}/>
        </div>
        <div>
          <Label htmlFor="cpf">CPF<span className="text-red-500">*</span></Label>
          <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} maxLength={14} className={errors.cpf ? "border-red-500" : ""}/>
          {errors.cpf && <p className="text-red-500 text-xs">{errors.cpf}</p>}
        </div>
        <div>
          <Label htmlFor="rg">RG<span className="text-red-500">*</span></Label>
          <Input id="rg" name="rg" placeholder="Seu RG" value={formData.rg} onChange={handleChange} className={errors.rg ? "border-red-500" : ""}/>
          {errors.rg && <p className="text-red-500 text-xs">{errors.rg}</p>}
        </div>
        <div>
          <Label htmlFor="birthDate">Data de Nascimento<span className="text-red-500">*</span></Label>
          <Input id="birthDate" name="birthDate" placeholder="DD/MM/AAAA" value={formData.birthDate} onChange={handleChange} maxLength={10} className={errors.birthDate ? "border-red-500" : ""}/>
          {errors.birthDate && <p className="text-red-500 text-xs">{errors.birthDate}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90" disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processando...</> : "Finalizar Cadastro"}
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full mt-2"
        onClick={() => setStep(2)}
      >
        <ChevronLeft className="inline mr-1" /> Voltar
      </Button>
    </form>
  );
};
