
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

interface AddCoverageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AddCoverageDialog({
  isOpen,
  onClose,
  onSave,
}: AddCoverageDialogProps) {
  const [formData, setFormData] = useState({
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      cep: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    } else if (!/^\d{8}$|^\d{5}-\d{3}$/.test(formData.cep.trim())) {
      newErrors.cep = "CEP inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const formatCep = (cep: string) => {
    // Remove any non-digits
    const digits = cep.replace(/\D/g, "");
    
    // If the input has 8 digits, format as 12345-678
    if (digits.length === 8) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    
    return digits;
  };

  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setFormData((prev) => ({ ...prev, cep: formattedCep }));
  };

  const searchCep = async () => {
    const normalizedCep = formData.cep.replace(/\D/g, "");
    
    if (normalizedCep.length !== 8) {
      setErrors({ cep: "CEP inválido" });
      return;
    }
    
    setSearchingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setErrors({ cep: "CEP não encontrado" });
        return;
      }
      
      setFormData({
        cep: normalizedCep,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      });
    } catch (error) {
      console.error("Error fetching CEP:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: "Não foi possível obter os dados do CEP informado",
      });
    } finally {
      setSearchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Normalize the CEP format (remove hyphens)
      const normalizedCep = formData.cep.replace(/\D/g, "");
      
      const { error } = await supabase
        .from("coverage_areas")
        .insert({
          cep: normalizedCep,
          endereco: formData.endereco,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
        });
      
      if (error) throw error;
      
      toast({
        title: "Endereço adicionado",
        description: "O novo endereço foi salvo com sucesso",
      });
      
      resetForm();
      onSave();
    } catch (error: any) {
      console.error("Error adding coverage area:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error.message || "Não foi possível adicionar o endereço",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-lg bg-white/90 border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#2b24a3]">Adicionar Novo Endereço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <div className="flex gap-2">
              <Input
                id="cep"
                name="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleInputChange}
                onBlur={handleCepBlur}
                maxLength={9}
                className={errors.cep ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={searchCep}
                disabled={searchingCep}
                className="flex-shrink-0"
              >
                {searchingCep ? "Buscando..." : <Search size={16} />}
              </Button>
            </div>
            {errors.cep && (
              <p className="text-xs text-red-500">{errors.cep}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Rua</Label>
            <Input
              id="endereco"
              name="endereco"
              placeholder="Endereço completo"
              value={formData.endereco}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              name="bairro"
              placeholder="Bairro"
              value={formData.bairro}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                name="estado"
                placeholder="UF"
                value={formData.estado}
                onChange={handleInputChange}
                maxLength={2}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#db451c] hover:bg-[#b93e19] text-white"
              disabled={loading}
            >
              {loading ? "Adicionando..." : "Adicionar Endereço"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
