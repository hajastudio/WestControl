
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddressData {
  number: string;
  complement: string;
  reference: string;
}

interface AddressStepProps {
  leadData: any;
  addressData: AddressData;
  errors: { number: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddressStep: React.FC<AddressStepProps> = ({
  leadData,
  addressData,
  errors,
  onChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="bg-brand-gray/20 p-4 rounded-lg mb-6">
      <h3 className="font-medium mb-2">Endereço Encontrado</h3>
      <p className="text-gray-700">{leadData.street}</p>
      <p className="text-gray-700">{leadData.neighborhood}, {leadData.city} - {leadData.state}</p>
      <p className="text-gray-700">CEP: {leadData.cep}</p>
    </div>
    <div className="space-y-2">
      <Label htmlFor="number">Número<span className="text-red-500">*</span></Label>
      <Input
        id="number"
        name="number"
        placeholder="Digite o número"
        value={addressData.number}
        onChange={onChange}
        className={errors.number ? "border-red-500" : ""}
      />
      {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="complement">Complemento</Label>
      <Input
        id="complement"
        name="complement"
        placeholder="Apartamento, bloco, etc."
        value={addressData.complement}
        onChange={onChange}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="reference">Ponto de Referência</Label>
      <Input
        id="reference"
        name="reference"
        placeholder="Ex: Próximo ao supermercado"
        value={addressData.reference}
        onChange={onChange}
      />
    </div>
    <Button 
      type="submit" 
      className="w-full bg-brand-blue hover:bg-brand-blue/90"
    >
      Continuar
    </Button>
  </form>
);
