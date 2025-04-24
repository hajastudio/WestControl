
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/types/viability";

interface PersonalFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isViable: boolean;
}

export const PersonalFields: React.FC<PersonalFieldsProps> = ({
  formData,
  onInputChange,
  isViable,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF *</Label>
        <Input 
          id="cpf" 
          name="cpf"
          value={formData.cpf || ""}
          onChange={onInputChange}
          required={isViable}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rg">RG *</Label>
        <Input 
          id="rg" 
          name="rg"
          value={formData.rg || ""}
          onChange={onInputChange}
          required={isViable}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de nascimento *</Label>
        <Input 
          id="birthDate" 
          name="birthDate"
          type="date"
          value={formData.birthDate || ""}
          onChange={onInputChange}
          required={isViable}
        />
      </div>
    </div>
  );
};
