
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalData {
  name?: string;
  cpf: string;
  rg: string;
  birthDate: string;
}
interface Errors {
  name?: string;
  cpf: string;
  rg: string;
  birthDate: string;
}

interface PersonalStepProps {
  personalData: PersonalData;
  errors: Errors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export const PersonalStep: React.FC<PersonalStepProps> = ({
  personalData,
  errors,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
}) => (
  <form id="personal-form" onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="cpf">CPF<span className="text-red-500">*</span></Label>
      <Input
        id="cpf"
        name="cpf"
        placeholder="000.000.000-00"
        value={personalData.cpf}
        onChange={onChange}
        className={errors.cpf ? "border-red-500" : ""}
        maxLength={14}
      />
      {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="rg">RG<span className="text-red-500">*</span></Label>
      <Input
        id="rg"
        name="rg"
        placeholder="Digite seu RG"
        value={personalData.rg}
        onChange={onChange}
        className={errors.rg ? "border-red-500" : ""}
      />
      {errors.rg && <p className="text-red-500 text-sm">{errors.rg}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="birthDate">Data de Nascimento<span className="text-red-500">*</span></Label>
      <Input
        id="birthDate"
        name="birthDate"
        placeholder="DD/MM/AAAA"
        value={personalData.birthDate}
        onChange={onChange}
        className={errors.birthDate ? "border-red-500" : ""}
        maxLength={10}
      />
      {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
    </div>
    <div className="flex gap-4">
      <button
        type="button"
        className="flex-1 border border-brand-blue text-brand-blue rounded-md py-3 font-medium hover:bg-brand-blue/10"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Voltar
      </button>
      <button
        type="submit"
        className="flex-1 bg-brand-blue text-white rounded-md py-3 font-medium hover:bg-brand-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Carregando..." : "Continuar"}
      </button>
    </div>
  </form>
);

