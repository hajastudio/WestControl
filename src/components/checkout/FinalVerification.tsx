
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Zap } from "lucide-react";
import type { FormData } from "./types";

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function FinalVerification({
  formData,
  onChange,
  onSubmit,
  onBack,
  isLoading,
}: Props) {
  // Format CPF input
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as CPF pattern: 000.000.000-00
    if (value.length > 0) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      
      // Limit to 11 digits
      if (value.replace(/\D/g, '').length > 11) {
        return;
      }
    }
    
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'cpf',
        value
      }
    };
    
    onChange(newEvent);
  };

  // Validate CPF and Date of Birth
  const isFormValid = () => {
    const cpfDigits = formData.cpf?.replace(/\D/g, '') || '';
    const hasValidCpf = cpfDigits.length === 11;
    const hasValidDate = !!formData.birthDate;
    
    return hasValidCpf && hasValidDate && !isLoading;
  };

  // Wrapper for onSubmit to handle event or no event
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Verify if we have all the required data before submitting
    if (!formData.cpf || !formData.birthDate) {
      return;
    }
    
    onSubmit();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold">Falta só mais um passo!</h3>
        </div>
        <p className="text-gray-600">
          Verifique seus dados e complete as informações abaixo
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">Seus dados:</h4>
        <p>Nome: {formData.name}</p>
        <p>Email: {formData.email}</p>
        <p>WhatsApp: {formData.whatsapp}</p>
        <p>Endereço: {formData.street}, {formData.number}</p>
        <p>{formData.neighborhood} - {formData.city}/{formData.state}</p>
      </div>

      <div>
        <Label htmlFor="cpf">CPF<span className="text-red-500">*</span></Label>
        <Input
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf || ""}
          onChange={handleCpfChange}
          required
        />
        {formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11 && (
          <p className="text-red-500 text-sm mt-1">CPF inválido. Digite todos os 11 dígitos.</p>
        )}
      </div>

      <div>
        <Label htmlFor="birthDate">Data de Nascimento<span className="text-red-500">*</span></Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate || ""}
          onChange={onChange}
          required
        />
      </div>

      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          disabled={!isFormValid()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalizando...
            </>
          ) : (
            "Continuar"
          )}
        </Button>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={onBack}
        disabled={isLoading}
      >
        <ArrowLeft className="inline mr-1" /> Voltar
      </Button>
    </div>
  );
}
