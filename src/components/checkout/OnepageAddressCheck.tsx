
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import type { FormData } from "./types";

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchAddress: (cep: string) => Promise<void>;
  onSubmit?: (e: React.FormEvent) => void;  // Made optional since it might not always be used
  onCepBlur: () => void;
  cepChecking: boolean;
  cepError: string | null;
  cepViable: boolean | null;
  setStep: (step: 1 | 2 | 3) => void;
  isLoading: boolean;
  handleJoinWaitlist: () => void;
}

export function OnepageAddressCheck({
  formData,
  onChange,
  fetchAddress,
  onSubmit,
  onCepBlur,
  cepChecking,
  cepError,
  cepViable,
  setStep,
  isLoading,
  handleJoinWaitlist,
}: Props) {
  // Create a form wrapper to handle the submit if provided
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="cep">CEP<span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Input
            id="cep"
            name="cep"
            placeholder="00000-000"
            value={formData.cep}
            onChange={onChange}
            onBlur={onCepBlur}
            maxLength={9}
            className={cepError ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="outline"
            disabled={cepChecking || !formData.cep || formData.cep.replace(/\D/g, "").length !== 8}
            onClick={() => fetchAddress(formData.cep)}
            className="min-w-[130px]"
          >
            {cepChecking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Buscando...</> : "Buscar endereço"}
          </Button>
        </div>
        {cepError && <p className="text-red-500 text-xs">{cepError}</p>}
      </div>

      {formData.street && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              name="street"
              placeholder="Rua"
              value={formData.street || ""}
              onChange={onChange}
            />
          </div>
          <div>
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              placeholder="Bairro"
              value={formData.neighborhood || ""}
              onChange={onChange}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                placeholder="Cidade"
                value={formData.city || ""}
                onChange={onChange}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="state">UF</Label>
              <Input
                id="state"
                name="state"
                placeholder="UF"
                value={formData.state || ""}
                onChange={onChange}
                maxLength={2}
              />
            </div>
          </div>
          {cepViable !== null && (
            <div className={`p-4 rounded-lg ${cepViable ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {cepViable ? (
                <p className="font-medium">✅ Ótima notícia! Temos cobertura no seu endereço.</p>
              ) : (
                <p className="font-medium">⚠️ No momento não temos cobertura neste endereço, mas podemos avisar quando estiver disponível.</p>
              )}
            </div>
          )}
          {cepViable !== null && (
            cepViable ? (
              <Button
                type="button"
                className="w-full mt-2 bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => setStep(3)}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full mt-2 bg-[#db451c] hover:bg-[#db451c]/90"
                onClick={handleJoinWaitlist}
              >
                Quero ser avisado
              </Button>
            )
          )}
        </div>
      )}

      <Button
        variant="outline"
        type="button"
        className="w-full mt-4"
        onClick={() => setStep(1)}
        disabled={isLoading}
      >
        <ArrowLeft className="inline mr-1" /> Voltar
      </Button>
    </div>
  );
}
