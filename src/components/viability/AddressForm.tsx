
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCpf } from "@/utils/cepUtils";
import { Loader2 } from "lucide-react";

interface AddressFormProps {
  onSubmit: (data: {
    number: string;
    complement: string;
    reference: string;
    cpf: string;
    rg: string;
    birthDate: string;
  }) => void;
  isLoading: boolean;
  addressData: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  isLoading,
  addressData,
}) => {
  const [formData, setFormData] = useState({
    number: "",
    complement: "",
    reference: "",
    cpf: "",
    rg: "",
    birthDate: "",
  });
  
  const [errors, setErrors] = useState<{
    number?: string;
    cpf?: string;
    rg?: string;
    birthDate?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "cpf") {
      setFormData({ ...formData, [name]: formatCpf(value) });
    } else if (name === "birthDate") {
      // Format as DD/MM/YYYY
      const digits = value.replace(/\D/g, "");
      let formatted = digits;
      
      if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }
      if (digits.length > 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }
      
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors: {
      number?: string;
      cpf?: string;
      rg?: string;
      birthDate?: string;
    } = {};
    
    if (!formData.number.trim()) {
      newErrors.number = "Número é obrigatório";
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
    }
    
    if (!formData.rg.trim()) {
      newErrors.rg = "RG é obrigatório";
    }
    
    if (!formData.birthDate.trim()) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    } else {
      const parts = formData.birthDate.split('/');
      if (parts.length !== 3 || parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 4) {
        newErrors.birthDate = "Data inválida. Use o formato DD/MM/AAAA";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 p-4 mb-6 rounded-lg border border-green-200">
        <h3 className="text-green-800 font-medium mb-2">Ótimas notícias!</h3>
        <p className="text-green-700 text-sm">
          Temos cobertura de internet no seu endereço. Complete seus dados para avançar.
        </p>
      </div>
      
      <div className="bg-brand-gray/20 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Endereço Encontrado</h3>
        <p className="text-sm mb-1">{addressData.street}</p>
        <p className="text-sm mb-1">{addressData.neighborhood}</p>
        <p className="text-sm">{addressData.city} - {addressData.state}</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="number">Número<span className="text-red-500">*</span></Label>
          <Input
            id="number"
            name="number"
            placeholder="123"
            value={formData.number}
            onChange={handleChange}
            className={errors.number ? "border-red-500" : ""}
          />
          {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            name="complement"
            placeholder="Apt 101, Casa 2, etc."
            value={formData.complement}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reference">Ponto de Referência</Label>
          <Input
            id="reference"
            name="reference"
            placeholder="Próximo à..."
            value={formData.reference}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <hr className="my-6" />
      
      <div className="space-y-4">
        <h3 className="font-semibold">Dados Pessoais</h3>
        
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF<span className="text-red-500">*</span></Label>
          <Input
            id="cpf"
            name="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={handleChange}
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
            value={formData.rg}
            onChange={handleChange}
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
            value={formData.birthDate}
            onChange={handleChange}
            className={errors.birthDate ? "border-red-500" : ""}
            maxLength={10}
          />
          {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#db451c] hover:bg-[#db451c]/90 text-white py-3 rounded-md font-medium transition-colors flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Finalizar Cadastro"
          )}
        </button>
      </div>
    </form>
  );
};
