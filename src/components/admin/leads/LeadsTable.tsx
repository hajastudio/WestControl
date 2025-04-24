
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, MoreHorizontal, MessageCircle } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  cep: string;
  status: string;
  created_at: string;
  updated_at: string;
  origem?: string;
}

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusLabel: (status: string) => string;
  onShowDetails: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, newStatus: string) => void;
  sendWhatsApp: (lead: Lead) => void;
  whatsappConfig: { webhook_url: string; default_message: string };
}

export function LeadsTable({
  leads,
  loading,
  getStatusBadge,
  getStatusLabel,
  onShowDetails,
  onUpdateStatus,
  sendWhatsApp,
  whatsappConfig,
}: LeadsTableProps) {
  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="overflow-x-auto text-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-sm">
              <TableHead className="text-xs font-semibold">Nome</TableHead>
              <TableHead className="text-xs font-semibold">WhatsApp</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">E-mail</TableHead>
              <TableHead className="text-xs font-semibold">CEP</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Origem</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Data</TableHead>
              <TableHead className="text-xs font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Carregando leads...
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Nenhum lead encontrado com os filtros atuais
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} className="text-sm border-t border-gray-100">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <span className="font-mono">{lead.whatsapp}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                  <TableCell>{lead.cep}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {lead.origem ? (
                      <Badge variant="outline">
                        {lead.origem}
                      </Badge>
                    ) : (
                      <Badge variant="outline">direto</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(lead.created_at).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onShowDetails(lead)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="end">
                          <div className="grid gap-1">
                            <div className="font-medium text-sm mb-1 px-2">Atualizar Status</div>
                            {['pending', 'viable', 'not_viable', 'waiting_docs', 'approved', 'rejected'].map((status) => (
                              <Button
                                key={status}
                                variant="ghost"
                                size="sm"
                                className="justify-start text-xs"
                                onClick={() => onUpdateStatus(lead.id, status)}
                              >
                                {getStatusLabel(status)}
                              </Button>
                            ))}
                            <hr className="my-1" />
                            {whatsappConfig.webhook_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="justify-start text-xs flex gap-2 items-center bg-[#db451c] hover:bg-[#a83413] text-white px-3 py-2"
                                onClick={() => sendWhatsApp(lead)}
                                style={{
                                  backgroundColor: "#db451c",
                                  color: "#fff",
                                  border: "1px solid #db451c",
                                }}
                              >
                                <MessageCircle className="h-4 w-4" />
                                Enviar Mensagem
                              </Button>
                            )}
                            {!whatsappConfig.webhook_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="justify-start text-xs flex gap-2 items-center bg-gray-100 text-gray-400 px-3 py-2 cursor-not-allowed"
                                onClick={() => sendWhatsApp(lead)}
                                tabIndex={-1}
                                disabled
                              >
                                <MessageCircle className="h-4 w-4" />
                                Enviar Mensagem
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
