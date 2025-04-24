
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { formatCep } from "@/utils/cepUtils";

interface StepCepCheckProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  leadId: string | null;
  setCepViable: (val: boolean | null) => void;
  cepViable: boolean | null;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
  setLeadId: (id: string | null) => void;
  supabase: any;
  setSuccessMsg: (msg: string) => void;
}

export const StepCepCheck: React.FC<StepCepCheckProps> = ({
  formData,
  setFormData,
  step,
  setStep,
  leadId,
  setCepViable,
  cepViable,
  setLeadId,
  supabase,
}) => {
  const [localCep, setLocalCep] = useState(formData.cep);
  const [checking, setChecking] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [addressLoaded, setAddressLoaded] = useState<boolean>(!!(formData.street || formData.city || formData.state));

  // Handler para deixar o CEP
  const handleCepBlur = async () => {
    if (localCep.replace(/\D/g, "").length === 8) {
      await fetchAddress(localCep);
    }
  };

  // Busca endereço na API ViaCEP
  const fetchAddress = async (cep: string) => {
    setChecking(true);
    setCepError(null);
    setAddressLoaded(false);
    const normalizedCep = cep.replace(/\D/g, "");
    if (normalizedCep.length !== 8) {
      setCepError("CEP inválido. Use o formato 00000-000");
      setChecking(false);
      return;
    }
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);
      const address = await resp.json();

      if (address.erro) {
        setCepError("CEP não encontrado.");
        setChecking(false);
        setAddressLoaded(false);
        setFormData((prev: any) => ({
          ...prev,
          street: "",
          neighborhood: "",
          city: "",
          state: "",
        }));
        return;
      }

      setFormData((prev: any) => ({
        ...prev,
        cep: formatCep(cep),
        street: address.logradouro || "",
        neighborhood: address.bairro || "",
        city: address.localidade || "",
        state: address.uf || "",
      }));
      setAddressLoaded(true);
      setCepViable(null); // Limpa viabilidade para este fluxo, ajuste se necessário
    } catch {
      setCepError("Erro ao buscar o endereço.");
      setAddressLoaded(false);
    } finally {
      setChecking(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCep(e.target.value);
    setLocalCep(value);
    setCepError(null);
    setAddressLoaded(false);
    setFormData((prev: any) => ({
      ...prev,
      cep: value,
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      complement: "",
      reference: "",
    }));
  };

  // Avança se endereço carregado e campos obrigatórios presentes
  const handleContinue = () => {
    setStep(3);
  };

  // Handler para editar campos de endereço manualmente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-8" onSubmit={e => e.preventDefault()}>
      <StepIndicator step={2} />
      <h3 className="text-xl font-semibold text-brand-blue mb-3">Verifique o CEP</h3>
      <div>
        <Label htmlFor="cep">CEP<span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Input
            id="cep"
            name="cep"
            placeholder="00000-000"
            value={localCep}
            onChange={handleCepChange}
            onBlur={handleCepBlur}
            maxLength={9}
            className={cepError ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="outline"
            disabled={checking || !localCep || localCep.replace(/\D/g, "").length !== 8}
            onClick={() => fetchAddress(localCep)}
            className="min-w-[130px]"
          >
            {checking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Buscando...</> : "Buscar endereço"}
          </Button>
        </div>
        {cepError && <p className="text-red-500 text-xs">{cepError}</p>}
      </div>

      {addressLoaded && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              name="street"
              placeholder="Rua"
              value={formData.street || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" name="neighborhood" placeholder="Bairro"
                   value={formData.neighborhood || ""}
                   onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" placeholder="Cidade" value={formData.city || ""} onChange={handleInputChange} />
            </div>
            <div className="w-24">
              <Label htmlFor="state">UF</Label>
              <Input id="state" name="state" placeholder="UF" value={formData.state || ""} onChange={handleInputChange} maxLength={2} />
            </div>
          </div>
          <div>
            <Label htmlFor="number">Número</Label>
            <Input id="number" name="number" placeholder="Número" value={formData.number || ""} onChange={handleInputChange} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" name="complement" placeholder="Apto, casa, etc." value={formData.complement || ""} onChange={handleInputChange} />
            </div>
            <div className="flex-1">
              <Label htmlFor="reference">Referência</Label>
              <Input id="reference" name="reference" placeholder="Ex: próximo ao mercado" value={formData.reference || ""} onChange={handleInputChange} />
            </div>
          </div>
          <Button
            type="button"
            className="w-full mt-2 bg-brand-blue hover:bg-brand-blue/90"
            onClick={handleContinue}
          >
            Prosseguir <ChevronRight className="inline ml-1" />
          </Button>
        </div>
      )}

      <Button
        variant="outline"
        type="button"
        className="w-full mt-4"
        disabled={step === 1}
        onClick={() => setStep(1)}
      >
        <ChevronLeft className="inline mr-1" /> Voltar
      </Button>
    </form>
  );
};
