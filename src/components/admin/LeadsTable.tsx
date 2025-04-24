import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, FileText, Check, X, AlertCircle, Clock } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  cep: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onLeadsUpdate: () => void;
}

export function LeadsTable({ leads, onLeadsUpdate }: LeadsTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      
      toast({
        title: "Status atualizado",
        description: `Status do lead alterado para ${getStatusLabel(newStatus)}.`
      });

      if (newStatus === 'viable') {
        try {
          const { data: updatedLead } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();
          
          const { data: config } = await supabase
            .from('configurations')
            .select('webhook_url')
            .single();
          
          if (config?.webhook_url) {
            await supabase
              .from('notifications')
              .insert({
                lead_id: leadId,
                message: "Lead aprovado com viabilidade técnica. Cliente notificado automaticamente.",
                status: "success"
              });
            
            const webhookData = {
              lead: updatedLead,
              timestamp: new Date().toISOString()
            };
            
            fetch(config.webhook_url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              mode: "no-cors",
              body: JSON.stringify(webhookData),
            }).catch(err => {
              console.error("Erro ao acionar webhook:", err);
            });
            
            toast({
              title: "Automação acionada",
              description: "Lead com viabilidade aprovada foi enviado automaticamente."
            });
          }
        } catch (webhookError) {
          console.error("Erro ao processar automação:", webhookError);
        }
      }
      
      onLeadsUpdate();
    } catch (error: any) {
      console.error('Error updating lead status:', error.message);
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      lead.cep.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </div>
        );
      case 'viable':
        return (
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            <Check className="h-3 w-3 mr-1" />
            Viável
          </div>
        );
      case 'not_viable':
        return (
          <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            <X className="h-3 w-3 mr-1" />
            Não Viável
          </div>
        );
      case 'waiting_docs':
        return (
          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            <FileText className="h-3 w-3 mr-1" />
            Aguardando Docs
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            <Check className="h-3 w-3 mr-1" />
            Aprovado
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            <AlertCircle className="h-3 w-3 mr-1" />
            Recusado
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pendente';
      case 'viable':
        return 'Viável';
      case 'not_viable':
        return 'Não Viável';
      case 'waiting_docs':
        return 'Aguardando Docs';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Recusado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="viable">Viável</SelectItem>
            <SelectItem value="not_viable">Não Viável</SelectItem>
            <SelectItem value="waiting_docs">Aguardando Docs</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="rejected">Recusado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>CEP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum lead encontrado com os filtros atuais
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.whatsapp}</TableCell>
                  <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                  <TableCell>{lead.cep}</TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Select
                        defaultValue={lead.status}
                        onValueChange={(value) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="h-8 w-[120px]">
                          <SelectValue placeholder="Atualizar" />
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500 text-right">
        Total: {filteredLeads.length} leads
      </div>
    </div>
  );
}
