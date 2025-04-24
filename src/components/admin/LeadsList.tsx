import React, { useState } from "react";
import { useLeads } from "@/hooks/useLeads";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LeadDetailsDialog } from "@/components/admin/leads/LeadDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cep: string;
  status: string;
  created_at: string;
  updated_at: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  reference?: string;
  cpf?: string;
  birthDate?: string;
  plantype?: string;
  businesstype?: string;
  customer_id?: string;
  customer_status?: string;
  customer_created_at?: string;
  customer_updated_at?: string;
}

interface WhatsAppConfig {
  webhook_url: string;
  default_message: string;
}

type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export function LeadsList() {
  const { leads, loading, error } = useLeads();
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    webhook_url: "",
    default_message: ""
  });

  React.useEffect(() => {
    fetchWhatsappConfig();
  }, []);

  const fetchWhatsappConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('webhook_url, default_message')
        .eq('key', 'whatsapp')
        .single();

      if (error) throw error;
      if (data) {
        setWhatsappConfig({
          webhook_url: data.webhook_url || "",
          default_message: data.default_message || ""
        });
      }
    } catch (error) {
      console.error('Error fetching WhatsApp config:', error);
      toast({
        title: "Erro ao carregar configuração do WhatsApp",
        description: "Não foi possível carregar as configurações do WhatsApp",
        variant: "destructive"
      });
    }
  };

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

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', leadId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do lead",
        variant: "destructive"
      });
    }
  };

  const sendWhatsApp = async (lead: Lead) => {
    if (!whatsappConfig.webhook_url) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Webhook do WhatsApp não configurado",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(whatsappConfig.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: lead.whatsapp,
          message: whatsappConfig.default_message.replace('{name}', lead.name || '')
        })
      });

      if (!response.ok) throw new Error('Failed to send WhatsApp message');

      toast({
        title: "Mensagem enviada",
        description: "Mensagem enviada com sucesso para o WhatsApp",
        variant: "default"
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem para o WhatsApp",
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
        Erro ao carregar leads: {error}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.whatsapp}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(lead.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedLead(lead);
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

      <LeadDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        lead={selectedLead}
        getStatusBadge={getStatusBadge}
        updateLeadStatus={updateLeadStatus}
        sendWhatsApp={sendWhatsApp}
        whatsappConfig={whatsappConfig}
      />
    </div>
  );
} 