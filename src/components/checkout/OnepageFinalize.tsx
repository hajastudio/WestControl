
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import type { FormData } from "./types";

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinalize: () => void;
  isLoading: boolean;
  setStep: (step: 1 | 2 | 3) => void;
}

export function OnepageFinalize({
  formData,
  onChange,
  onFinalize,
  isLoading,
  setStep,
}: Props) {
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="number">Número<span className="text-red-500">*</span></Label>
        <Input
          id="number"
          name="number"
          placeholder="Número"
          value={formData.number}
          onChange={onChange}
          required
          className={!formData.number ? "border-red-300" : ""}
        />
        {!formData.number && (
          <p className="text-sm text-red-500 mt-1">Campo obrigatório</p>
        )}
      </div>
      <div>
        <Label htmlFor="complement">Complemento</Label>
        <Input
          id="complement"
          name="complement"
          placeholder="Apto, casa, etc."
          value={formData.complement}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="reference">Referência</Label>
        <Input
          id="reference"
          name="reference"
          placeholder="Ex: próximo ao mercado"
          value={formData.reference}
          onChange={onChange}
        />
      </div>
      <div className="pt-4">
        <Button
          onClick={onFinalize}
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          disabled={isLoading || !formData.number}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalizando...
            </>
          ) : (
            "Finalizar Contratação"
          )}
        </Button>
      </div>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => setStep(2)}
        disabled={isLoading}
      >
        <ArrowLeft className="inline mr-1" /> Voltar
      </Button>
    </div>
  );
}
