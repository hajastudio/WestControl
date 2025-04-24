import React, { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useLeadContext } from "@/context/LeadContext";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CombinedData {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cep: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  reference?: string;
  cpf?: string;
  birthDate?: string;
  status: string;
  created_at: string;
  updated_at: string;
  plantype?: string;
  businesstype?: string;
}

export function SuccessMessage() {
  const { leadData, setLeadData } = useLeadContext();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("id");
  
  // If we have a leadId in URL but no leadData, fetch the lead data
  useEffect(() => {
    const fetchLeadData = async () => {
      if (leadId && (!leadData.id || leadData.id !== leadId)) {
        try {
          console.log("Buscando dados do lead com ID:", leadId);
          // Busca dados do lead
          const { data: leadData, error: leadError } = await supabase
            .from("leads")
            .select("*")
            .eq("id", leadId)
            .maybeSingle();
            
          if (leadError) throw leadError;
          
          console.log("Dados do lead encontrados:", {
            id: leadData?.id,
            name: leadData?.name,
            email: leadData?.email,
            whatsapp: leadData?.whatsapp,
            status: leadData?.status,
            street: leadData?.street,
            number: leadData?.number,
            complement: leadData?.complement,
            neighborhood: leadData?.neighborhood,
            city: leadData?.city,
            state: leadData?.state,
            reference: leadData?.reference,
            cpf: leadData?.cpf,
            birthDate: leadData?.birthDate,
            plantype: leadData?.plantype,
            businesstype: leadData?.businesstype
          });
          
          // Busca dados do customer
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("*")
            .eq("lead_id", leadId)
            .maybeSingle();
            
          if (customerError) throw customerError;
          
          console.log("Dados do customer encontrados:", {
            id: customerData?.id,
            lead_id: customerData?.lead_id,
            name: customerData?.name,
            email: customerData?.email,
            whatsapp: customerData?.whatsapp,
            street: customerData?.street,
            number: customerData?.number,
            complement: customerData?.complement,
            neighborhood: customerData?.neighborhood,
            city: customerData?.city,
            state: customerData?.state,
            reference: customerData?.reference,
            cpf: customerData?.cpf,
            cep: customerData?.cep
          });
          
          // Combina os dados
          const combinedData: CombinedData = {
            id: leadData?.id || "",
            name: customerData?.name || leadData?.name || "",
            email: customerData?.email || leadData?.email || "",
            whatsapp: customerData?.whatsapp || leadData?.whatsapp || "",
            cep: customerData?.cep || leadData?.cep || "",
            street: customerData?.street || leadData?.street,
            number: customerData?.number || leadData?.number,
            complement: customerData?.complement || leadData?.complement,
            neighborhood: customerData?.neighborhood || leadData?.neighborhood,
            city: customerData?.city || leadData?.city,
            state: customerData?.state || leadData?.state,
            reference: customerData?.reference || leadData?.reference,
            cpf: customerData?.cpf || leadData?.cpf,
            birthDate: leadData?.birthDate,
            status: leadData?.status || "",
            created_at: leadData?.created_at || "",
            updated_at: leadData?.updated_at || "",
            plantype: leadData?.plantype,
            businesstype: leadData?.businesstype
          };
          
          console.log("Comparação de dados:", {
            lead: {
              street: leadData?.street,
              number: leadData?.number,
              complement: leadData?.complement,
              neighborhood: leadData?.neighborhood,
              city: leadData?.city,
              state: leadData?.state
            },
            customer: {
              street: customerData?.street,
              number: customerData?.number,
              complement: customerData?.complement,
              neighborhood: customerData?.neighborhood,
              city: customerData?.city,
              state: customerData?.state
            },
            combined: {
              street: combinedData.street,
              number: combinedData.number,
              complement: combinedData.complement,
              neighborhood: combinedData.neighborhood,
              city: combinedData.city,
              state: combinedData.state
            }
          });
          
          setLeadData(combinedData);
          
          // Envia dados para o webhook
          try {
            const { data: config } = await supabase
              .from('configurations')
              .select('webhook_url')
              .single();
              
            if (config?.webhook_url) {
              const webhookData = {
                lead: combinedData,
                timestamp: new Date().toISOString()
              };
              
              console.log("Enviando dados para o webhook:", webhookData);
              
              await fetch(config.webhook_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(webhookData),
              });
              
              console.log("Dados enviados com sucesso para o webhook");
            }
          } catch (webhookError) {
            console.error("Erro ao enviar dados para o webhook:", webhookError);
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      } else {
        console.log("Usando dados do lead do contexto:", {
          id: leadData.id,
          name: leadData.name,
          email: leadData.email,
          whatsapp: leadData.whatsapp,
          status: leadData.status,
          street: leadData.street,
          number: leadData.number,
          complement: leadData.complement,
          neighborhood: leadData.neighborhood,
          city: leadData.city,
          state: leadData.state,
          reference: leadData.reference,
          cpf: leadData.cpf,
          birthDate: leadData.birthDate,
          plantype: leadData.plantype,
          businesstype: leadData.businesstype
        });
      }
    };
    
    fetchLeadData();
  }, [leadId, leadData.id, setLeadData]);

  // Format WhatsApp number for display
  const formatWhatsApp = (whatsapp: string) => {
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length === 11) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    }
    return whatsapp;
  };

  // Format address for display
  const formatAddress = () => {
    console.log("Formatando endereço com dados:", {
      street: leadData?.street,
      number: leadData?.number,
      complement: leadData?.complement,
      neighborhood: leadData?.neighborhood,
      city: leadData?.city,
      state: leadData?.state,
      cep: leadData?.cep
    });

    const parts = [];
    if (leadData?.street) {
      const streetPart = `${leadData.street}${leadData.number ? `, ${leadData.number}` : ''}`;
      console.log("Adicionando rua e número:", streetPart);
      parts.push(streetPart);
    }
    if (leadData?.complement) {
      console.log("Adicionando complemento:", leadData.complement);
      parts.push(leadData.complement);
    }
    if (leadData?.neighborhood) {
      console.log("Adicionando bairro:", leadData.neighborhood);
      parts.push(leadData.neighborhood);
    }
    if (leadData?.city || leadData?.state) {
      const cityStatePart = `${leadData.city || ''}${leadData.state ? ` - ${leadData.state}` : ''}`;
      console.log("Adicionando cidade e estado:", cityStatePart);
      parts.push(cityStatePart);
    }
    if (leadData?.cep) {
      console.log("Adicionando CEP:", leadData.cep);
      parts.push(`CEP: ${leadData.cep}`);
    }

    const formattedAddress = parts.join(', ') || 'Endereço não informado';
    console.log("Endereço formatado:", formattedAddress);
    return formattedAddress;
  };

  // Format plan type for display
  const formatPlanType = () => {
    if (!leadData.plantype) return 'Não informado';
    
    return leadData.businesstype === "residential" 
      ? `${leadData.plantype} (Residencial)` 
      : `${leadData.plantype} (Empresarial${leadData.businesstype ? ` - ${leadData.businesstype === "semi" ? "Semi Dedicado" : "Dedicado"}` : ''})`;
  };

  console.log("Current lead data in SuccessMessage:", leadData);

  return (
    <div className="py-12 bg-brand-gray/30">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M15.88 8.29L10 14.17L8.12 12.29C7.73 11.9 7.1 11.9 6.71 12.29C6.32 12.68 6.32 13.31 6.71 13.7L9.3 16.29C9.69 16.68 10.32 16.68 10.71 16.29L17.3 9.7C17.69 9.31 17.69 8.68 17.3 8.29C16.91 7.9 16.27 7.9 15.88 8.29Z" fill="currentColor"/>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Cadastro Realizado com Sucesso!</h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Recebemos suas informações e entraremos em contato via WhatsApp em breve para agendar sua instalação.
            </p>
            
            <div className="bg-brand-blue/10 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-bold text-xl mb-4 text-center">Resumo do seu Pedido</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{leadData?.name || "Não informado"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">{formatAddress()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tipo de Plano</p>
                  <p className="font-medium">{formatPlanType()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Contatos</p>
                  <div className="space-y-1">
                    <p className="font-medium">
                      <span className="text-gray-500">WhatsApp:</span> {leadData?.whatsapp ? formatWhatsApp(leadData.whatsapp) : "Não informado"}
                    </p>
                    <p className="font-medium">
                      <span className="text-gray-500">E-mail:</span> {leadData?.email || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Voltar para o Início
                </Button>
              </Link>
              <Link to={leadData?.id ? `/client?id=${leadData.id}` : "/"} className="flex-1">
                <Button className="flex-1 bg-brand-yellow text-black hover:bg-brand-yellow/90 w-full">
                  Acompanhar Instalação
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              Você também receberá um e-mail com o link para acompanhar o status da sua instalação.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SuccessMessage;
