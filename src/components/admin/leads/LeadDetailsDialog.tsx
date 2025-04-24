import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/hooks/useLeads";

interface LeadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  getStatusBadge: (status: string) => React.ReactNode;
  updateLeadStatus: (leadId: string, newStatus: string) => void;
  sendWhatsApp: (lead: Lead) => void;
  whatsappConfig: { webhook_url: string; default_message: string };
}

export function LeadDetailsDialog({
  open,
  onOpenChange,
  lead,
  getStatusBadge,
  updateLeadStatus,
  sendWhatsApp,
  whatsappConfig,
}: LeadDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => (
    <div className="flex items-start gap-2 mb-2">
      <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <span className="text-sm text-gray-500">{label}:</span>
        <p className="text-gray-900">{value || "Não informado"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white/80 backdrop-blur p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Ficha do Lead
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie as informações do lead {lead?.name}
          </DialogDescription>
        </DialogHeader>
        
        {lead && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusBadge(lead.status)}
                <Select 
                  value={lead.status} 
                  onValueChange={(value) => updateLeadStatus(lead.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Alterar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="viable">Viável</SelectItem>
                    <SelectItem value="not_viable">Não Viável</SelectItem>
                    <SelectItem value="waiting_docs">Aguardando Docs</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Recusado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {whatsappConfig.webhook_url && (
                <Button
                  onClick={() => sendWhatsApp(lead)}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contatar via WhatsApp
                </Button>
              )}
            </div>

            <InfoSection title="Informações Pessoais">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={User} label="Nome" value={lead.name} />
                <InfoItem icon={Mail} label="E-mail" value={lead.email} />
                <InfoItem icon={Phone} label="WhatsApp" value={lead.whatsapp} />
                <InfoItem icon={FileText} label="CPF" value={lead.cpf} />
                <InfoItem icon={FileText} label="RG" value={lead.rg} />
                <InfoItem icon={Calendar} label="Data de Nascimento" value={lead.birthDate} />
              </div>
            </InfoSection>

            <InfoSection title="Endereço">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={MapPin} label="CEP" value={lead.cep} />
                <InfoItem icon={MapPin} label="Rua" value={lead.street} />
                <InfoItem icon={MapPin} label="Número" value={lead.number} />
                <InfoItem icon={MapPin} label="Complemento" value={lead.complement} />
                <InfoItem icon={MapPin} label="Bairro" value={lead.neighborhood} />
                <InfoItem icon={MapPin} label="Cidade" value={lead.city} />
                <InfoItem icon={MapPin} label="Estado" value={lead.state} />
                <InfoItem icon={MapPin} label="Ponto de Referência" value={lead.reference} />
              </div>
            </InfoSection>

            <InfoSection title="Informações do Plano">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={FileText} label="Tipo de Plano" value={lead.plantype} />
                <InfoItem icon={FileText} label="Tipo de Negócio" value={lead.businesstype} />
                <InfoItem icon={FileText} label="Origem" value={lead.origem || "Acesso Direto"} />
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mt-4">
                    Criado em: {formatDate(lead.created_at)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Última atualização: {formatDate(lead.updated_at)}
                  </p>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Informações do Cliente">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={FileText} label="ID do Cliente" value={lead.customer_id} />
                <InfoItem icon={FileText} label="Status do Cliente" value={lead.customer_status} />
                <InfoItem icon={Calendar} label="Data de Criação do Cliente" value={formatDate(lead.customer_created_at)} />
                <InfoItem icon={Calendar} label="Última Atualização do Cliente" value={formatDate(lead.customer_updated_at)} />
              </div>
            </InfoSection>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
