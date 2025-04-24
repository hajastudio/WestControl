
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface AddressFormData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function ViabilityAddressInput({ onAddressAdded }: { onAddressAdded: () => void }) {
  const [formData, setFormData] = useState<AddressFormData>({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('viability')
        .insert([{ 
          ...formData,
          is_viable: true 
        }]);

      if (error) throw error;

      toast({
        title: "Endereço adicionado",
        description: "Endereço registrado com sucesso na base de viabilidade."
      });
      
      setFormData({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: ""
      });
      onAddressAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            name="cep"
            type="text"
            placeholder="Digite o CEP"
            value={formData.cep}
            onChange={handleChange}
            pattern="[0-9]{8}"
            maxLength={8}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            name="street"
            type="text"
            placeholder="Nome da rua"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            name="number"
            type="text"
            placeholder="Número"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            name="complement"
            type="text"
            placeholder="Complemento (opcional)"
            value={formData.complement}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            name="neighborhood"
            type="text"
            placeholder="Bairro"
            value={formData.neighborhood}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            type="text"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            type="text"
            placeholder="Estado"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adicionando..." : "Adicionar Endereço"}
      </Button>
    </form>
  );
}
