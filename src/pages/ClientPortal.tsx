
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { formatWhatsAppMessage, openWhatsApp } from "@/utils/whatsappUtils";
import { useLeadContext } from "@/context/LeadContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClientPortal = () => {
  const [searchParams] = useSearchParams();
  const { leadData, setLeadData } = useLeadContext();
  const [loading, setLoading] = useState(false);

  // Get lead ID from URL parameters
  const leadId = searchParams.get('id');

  // Fetch lead data from Supabase if not already in context
  useEffect(() => {
    const fetchLeadData = async () => {
      if (!leadId) return;
      
      // If no lead data in context or ID doesn't match URL param
      if (!leadData.id || leadData.id !== leadId) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("leads")
            .select("*")
            .eq("id", leadId)
            .maybeSingle();
            
          if (error) throw error;
          if (data) setLeadData(data);
        } catch (error) {
          console.error("Error fetching lead data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchLeadData();
  }, [leadId]);

  // Número de WhatsApp da empresa
  const companyWhatsApp = "5521985219470"; // Número com código do país (55) e DDD (21)

  const handleWhatsAppClick = () => {
    const message = formatWhatsAppMessage({
      name: leadData.name || "Cliente",
      plan: leadData.planType === "residential" ? "Residencial Fibra" : "Empresarial",
      status: leadData.status || "Em instalação",
      id: leadId || "",
      address: `${leadData.street || ""}, ${leadData.number || ""}, ${leadData.neighborhood || ""} - ${leadData.city || ""}`
    });
    
    openWhatsApp(companyWhatsApp, message);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando informações...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-brand-gray/10">
        <div className="py-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-brand-blue text-white">
                  <h1 className="text-2xl font-bold">Olá, {leadData.name || "Cliente"}!</h1>
                  <p>Acompanhe o status da sua instalação</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Status da Instalação</h2>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="h-1 w-full bg-gray-200"></div>
                      </div>
                      <div className="relative flex justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium">Cadastro</div>
                            <div className="text-xs text-gray-500">Concluído</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium">Análise</div>
                            <div className="text-xs text-gray-500">Concluído</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium">Agendamento</div>
                            <div className="text-xs text-yellow-500">Em andamento</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm">4</span>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium">Instalação</div>
                            <div className="text-xs text-gray-500">Pendente</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm">5</span>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium">Ativação</div>
                            <div className="text-xs text-gray-500">Pendente</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
                    <h3 className="font-medium text-yellow-800 mb-2">Próximos Passos</h3>
                    <p className="text-yellow-700">
                      Nossa equipe entrará em contato em breve para agendar sua instalação. 
                      Você receberá uma mensagem no WhatsApp com a data e horário.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Dados do Plano</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plano:</span>
                          <span className="font-medium">
                            {leadData.planType === "residential" ? "Residencial" : "Empresarial"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {leadData.status === "aguardando_documentos" ? "Aguardando Documentos" : 
                             leadData.status === "lista_espera" ? "Lista de Espera" : 
                             "Em processamento"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Endereço de Instalação</h3>
                      <div className="space-y-1">
                        <p>
                          {leadData.street || ""}{leadData.number ? `, ${leadData.number}` : ""}
                          {leadData.complement ? `, ${leadData.complement}` : ""}
                        </p>
                        <p>
                          {leadData.neighborhood || ""}
                          {(leadData.city || leadData.state) ? ` - ${leadData.city || ""}${leadData.state ? `/${leadData.state}` : ""}` : ""}
                        </p>
                        <p>CEP: {leadData.cep || "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Precisa de Ajuda?</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-brand-yellow text-black hover:bg-brand-yellow/90 flex-1"
                        onClick={handleWhatsAppClick}
                      >
                        Falar pelo WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Enviar E-mail
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientPortal;
