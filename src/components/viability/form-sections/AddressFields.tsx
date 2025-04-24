
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormData } from "@/types/viability";

interface AddressFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isViable: boolean;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({
  formData,
  onInputChange,
  isViable,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="street">Rua</Label>
        <Input 
          id="street" 
          name="street"
          value={formData.street || ""}
          onChange={onInputChange}
          readOnly
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="number">Número *</Label>
        <Input 
          id="number" 
          name="number"
          value={formData.number || ""}
          onChange={onInputChange}
          required={isViable}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input 
          id="neighborhood" 
          name="neighborhood"
          value={formData.neighborhood || ""}
          onChange={onInputChange}
          readOnly
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="complement">Complemento</Label>
        <Input 
          id="complement" 
          name="complement"
          value={formData.complement || ""}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Input 
          id="city" 
          name="city"
          value={formData.city || ""}
          onChange={onInputChange}
          readOnly
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Input 
          id="state" 
          name="state"
          value={formData.state || ""}
          onChange={onInputChange}
          readOnly
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reference">Ponto de referência</Label>
        <Textarea 
          id="reference" 
          name="reference"
          value={formData.reference || ""}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};
