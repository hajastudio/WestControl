import React, { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CustomerDetailsDialog } from "./customers/CustomerDetailsDialog";
import { Loader2 } from "lucide-react";

export function CustomersList() {
  const { customers, loading, error, updateCustomerStatus, updateCustomerPlan } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: "Pendente", variant: "default" },
      aguardando_documentos: { label: "Aguardando Documentos", variant: "warning" },
      lista_espera: { label: "Lista de Espera", variant: "secondary" },
      viable: { label: "Viável", variant: "success" },
      not_viable: { label: "Não Viável", variant: "destructive" },
      contratado: { label: "Contratado", variant: "success" },
      cancelado: { label: "Cancelado", variant: "destructive" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "default" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const handleStatusUpdate = async (customerId: string, newStatus: string) => {
    try {
      await updateCustomerStatus(customerId, newStatus);
      toast({
        title: "Status atualizado",
        description: "O status do cliente foi atualizado com sucesso",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do cliente",
        variant: "destructive"
      });
    }
  };

  const handlePlanUpdate = async (customerId: string, planType: string, businessType: string) => {
    try {
      await updateCustomerPlan(customerId, planType, businessType);
      toast({
        title: "Plano atualizado",
        description: "O plano do cliente foi atualizado com sucesso",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar o plano do cliente",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Erro ao carregar clientes: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.whatsapp}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(customer.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.plan_type} - {customer.business_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(customer.created_at || ''), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setDetailsOpen(true);
                    }}
                  >
                    Ver detalhes
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        customer={selectedCustomer}
        onStatusUpdate={handleStatusUpdate}
        onPlanUpdate={handlePlanUpdate}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
} 