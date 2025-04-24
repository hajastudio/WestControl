
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { CoverageAreaType } from "@/types/coverage-area";
import { useToast } from "@/hooks/use-toast";

interface EditCoverageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  item: CoverageAreaType;
}

export function EditCoverageDialog({ isOpen, onClose, onSave, item }: EditCoverageDialogProps) {
  const [formData, setFormData] = useState({
    cep: item.cep || "",
    rua: item.rua || "",
    bairro: item.bairro || "",
    cidade: item.cidade || "",
    estado: item.estado || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format CEP to remove any non-digits
      const formattedCep = formData.cep.replace(/\D/g, "");

      const { error } = await supabase
        .from("coverage_areas")
        .update({
          cep: formattedCep,
          rua: formData.rua,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
        })
        .eq("id", item.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Área de cobertura atualizada com sucesso.",
      });
      onSave();
    } catch (error: any) {
      console.error("Error updating coverage area:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro ao atualizar a área de cobertura.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Área de Cobertura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="Digite o CEP (somente números)"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rua">Rua</Label>
              <Input
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                placeholder="Nome da rua"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Nome do bairro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="Nome da cidade"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  placeholder="UF"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#2b24a3] hover:bg-[#201b7a]"
            >
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
