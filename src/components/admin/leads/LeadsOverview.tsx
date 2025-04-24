
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  FileText,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadsFiltersBar } from "./LeadsFiltersBar";
import { LeadsTable } from "./LeadsTable";
import { LeadDetailsDialog } from "./LeadDetailsDialog";

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

export function LeadsOverview() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [whatsappConfig, setWhatsappConfig] = useState({
    webhook_url: "",
    default_message: ""
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const origins = ["direct", "facebook", "instagram", "google", "referral", "internet-residencial", "internet-empresarial"];

  useEffect(() => {
    fetchLeads();
    fetchWhatsappConfig();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, statusFilter, originFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setLeads(data);
        setTotalLeads(data.length);
      }
    } catch (error: any) {
      console.error('Error fetching leads:', error.message);
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWhatsappConfig = async () => {
    const { data } = await supabase
      .from('configurations')
      .select('webhook_url, default_message')
      .single();
    
    if (data) {
      setWhatsappConfig({
        webhook_url: data.webhook_url || "",
        default_message: data.default_message || ""
      });
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        lead => lead.name.toLowerCase().includes(search) || 
                lead.email.toLowerCase().includes(search) || 
                lead.whatsapp.includes(search)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    if (originFilter !== "all") {
      filtered = filtered.filter(lead => lead.origem === originFilter);
    }
    setFilteredLeads(filtered);
    setPage(1);
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
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } 
            : lead
        )
      );
      toast({
        title: "Status atualizado",
        description: `Status do lead alterado para ${getStatusLabel(newStatus)}.`
      });
    } catch (error: any) {
      console.error('Error updating lead status:', error.message);
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendWhatsApp = (lead: Lead) => {
    if (!whatsappConfig.webhook_url) {
      toast({
        title: "Webhook não configurado",
        description: "Configure o webhook na seção de Notificações para enviar mensagens.",
        variant: "destructive"
      });
      return;
    }
    const phone = lead.whatsapp.replace(/\D/g, "");
    const message = whatsappConfig.default_message || 
      `Olá ${lead.name}, estamos entrando em contato sobre sua solicitação de Internet.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case 'viable':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
            <Check className="h-3 w-3" />
            Viável
          </Badge>
        );
      case 'not_viable':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 text-xs">
            <X className="h-3 w-3" />
            Não Viável
          </Badge>
        );
      case 'waiting_docs':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 text-xs">
            <FileText className="h-3 w-3" />
            Aguardando Docs
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1 text-xs">
            <Check className="h-3 w-3" />
            Aprovado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1 text-xs">
            <AlertCircle className="h-3 w-3" />
            Recusado
          </Badge>
        );
      default:
        return <Badge className="text-xs">{status}</Badge>;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: {[key: string]: string} = {
      'pending': 'Pendente',
      'viable': 'Viável',
      'not_viable': 'Não Viável',
      'waiting_docs': 'Aguardando Docs',
      'approved': 'Aprovado',
      'rejected': 'Recusado'
    };
    return statusMap[status] || status;
  };

  const getPaginatedLeads = () => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredLeads.slice(start, end);
  };

  return (
    <div className="space-y-8 p-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Gerenciamento de Leads</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total: {totalLeads} leads</span>
          </div>
        </div>

        <LeadsFiltersBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          originFilter={originFilter}
          setOriginFilter={setOriginFilter}
          origins={origins}
        />

        <LeadsTable
          leads={getPaginatedLeads()}
          loading={loading}
          getStatusBadge={getStatusBadge}
          getStatusLabel={getStatusLabel}
          onShowDetails={(lead) => {
            setSelectedLead(lead);
            setDetailsOpen(true);
          }}
          onUpdateStatus={updateLeadStatus}
          sendWhatsApp={sendWhatsApp}
          whatsappConfig={whatsappConfig}
        />

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Lead Details Dialog */}
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

