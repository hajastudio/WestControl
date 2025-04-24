import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/hooks/useCustomers";

interface CustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onStatusUpdate: (customerId: string, newStatus: string) => Promise<void>;
  onPlanUpdate: (customerId: string, planType: string, businessType: string) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function CustomerDetailsDialog({
  open,
  onOpenChange,
  customer,
  onStatusUpdate,
  onPlanUpdate,
  getStatusBadge
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  const handleStatusChange = async (newStatus: string) => {
    await onStatusUpdate(customer.id, newStatus);
  };

  const handlePlanChange = async (planType: string, businessType: string) => {
    await onPlanUpdate(customer.id, planType, businessType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Visualize e gerencie as informações do cliente {customer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Informações Pessoais</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nome:</span> {customer.name}</p>
                <p><span className="font-medium">Email:</span> {customer.email}</p>
                <p><span className="font-medium">WhatsApp:</span> {customer.whatsapp}</p>
                <p><span className="font-medium">CPF:</span> {customer.cpf}</p>
                <p><span className="font-medium">RG:</span> {customer.rg || "Não informado"}</p>
                <p><span className="font-medium">Data de Nascimento:</span> {customer.birth_date || "Não informada"}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Endereço</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">CEP:</span> {customer.cep}</p>
                <p><span className="font-medium">Rua:</span> {customer.street}</p>
                <p><span className="font-medium">Número:</span> {customer.number || "Não informado"}</p>
                <p><span className="font-medium">Complemento:</span> {customer.complement || "Não informado"}</p>
                <p><span className="font-medium">Bairro:</span> {customer.neighborhood || "Não informado"}</p>
                <p><span className="font-medium">Cidade:</span> {customer.city}</p>
                <p><span className="font-medium">Estado:</span> {customer.state}</p>
                <p><span className="font-medium">Referência:</span> {customer.reference || "Não informada"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Status do Cliente</h3>
              <Select
                value={customer.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aguardando_documentos">Aguardando Documentos</SelectItem>
                  <SelectItem value="lista_espera">Lista de Espera</SelectItem>
                  <SelectItem value="viable">Viável</SelectItem>
                  <SelectItem value="not_viable">Não Viável</SelectItem>
                  <SelectItem value="contratado">Contratado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Plano</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={customer.plan_type || ""}
                  onValueChange={(value) => handlePlanChange(value, customer.business_type || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fibra">Fibra</SelectItem>
                    <SelectItem value="radio">Rádio</SelectItem>
                    <SelectItem value="satelite">Satélite</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={customer.business_type || ""}
                  onValueChange={(value) => handlePlanChange(customer.plan_type || "", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Negócio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residencial">Residencial</SelectItem>
                    <SelectItem value="semi">Semi</SelectItem>
                    <SelectItem value="dedicado">Dedicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 