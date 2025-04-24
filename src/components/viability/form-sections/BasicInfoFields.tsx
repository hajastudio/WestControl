
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/types/viability";

interface BasicInfoFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input 
          id="name" 
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input 
          id="email" 
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp *</Label>
        <Input 
          id="whatsapp" 
          name="whatsapp"
          value={formData.whatsapp}
          onChange={onInputChange}
          placeholder="(00) 00000-0000"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cep">CEP *</Label>
        <Input 
          id="cep" 
          name="cep"
          value={formData.cep}
          onChange={onInputChange}
          placeholder="00000-000"
          required
        />
      </div>
    </div>
  );
};
