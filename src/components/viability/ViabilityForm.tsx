
import React from "react";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form-sections/BasicInfoFields";
import { AddressFields } from "./form-sections/AddressFields";
import { PersonalFields } from "./form-sections/PersonalFields";
import { ViabilityStatus } from "./form-sections/ViabilityStatus";
import type { FormData } from "@/types/viability";

interface ViabilityFormProps {
  formData: FormData;
  isViable: boolean | null;
  isLoading: boolean;
  addressLoaded: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const ViabilityForm: React.FC<ViabilityFormProps> = ({
  formData,
  isViable,
  isLoading,
  addressLoaded,
  error,
  onInputChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <BasicInfoFields formData={formData} onInputChange={onInputChange} />
      
      {formData.cep && formData.cep.replace(/\D/g, "").length < 8 && (
        <p className="text-sm text-gray-500">Digite o CEP completo para verificarmos a viabilidade.</p>
      )}
      
      {isLoading && (
        <p className="text-sm text-blue-600">Verificando viabilidade...</p>
      )}

      {isViable === true && addressLoaded && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">✓ Boa notícia! Atendemos sua região</h3>
          <AddressFields
            formData={formData}
            onInputChange={onInputChange}
            isViable={isViable}
          />
          <PersonalFields
            formData={formData}
            onInputChange={onInputChange}
            isViable={isViable}
          />
        </div>
      )}

      <ViabilityStatus isViable={isViable} isLoading={isLoading} error={error} />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name || !formData.email || !formData.whatsapp || !formData.cep}
          className="w-full md:w-auto bg-brand-blue hover:bg-brand-blue/90"
        >
          {isLoading ? "Processando..." : 
           isViable === true ? "Prosseguir com o cadastro" : 
           isViable === false ? "Entrar na lista de espera" : 
           "Verificar disponibilidade"}
        </Button>
      </div>
    </form>
  );
};
