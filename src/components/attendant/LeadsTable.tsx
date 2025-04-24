
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeadsTableProps {
  leads: any[];
  onLeadUpdate: (updatedLead: any) => void;
}

export default function LeadsTable({ leads, onLeadUpdate }: LeadsTableProps) {
  const { toast } = useToast();

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const currentDateISO = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus, 
          updated_at: currentDateISO 
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Status atualizado",
          description: `Lead atualizado para ${getStatusLabel(newStatus)}`,
        });
        onLeadUpdate(data);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      approved: "Aprovado",
      rejected: "Recusado",
      analyzing: "Em análise",
      waitlist: "Lista de espera",
      viable: "Viável",
      waiting_docs: "Aguardando documentos"
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeStyle = (status: string): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "analyzing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "waitlist":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "viable":
        return "bg-green-50 text-green-600 border-green-100";
      case "waiting_docs":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                Nenhum lead encontrado com os filtros selecionados
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.whatsapp}</TableCell>
                <TableCell>{lead.cep}</TableCell>
                <TableCell>{lead.plan || "Não definido"}</TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        <Badge className={`${getStatusBadgeStyle(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Recusado</SelectItem>
                      <SelectItem value="analyzing">Em análise</SelectItem>
                      <SelectItem value="waitlist">Lista de espera</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
