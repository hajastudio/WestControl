import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { FormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useLeadContext } from "@/context/LeadContext";

export const useCheckoutSubmission = (
  leadId: string | null,
  setIsLoading: (loading: boolean) => void,
  onClose: () => void,
  resetForm: () => void,
  setLeadId: (id: string | null) => void,
  setCepViable: (viable: boolean | null) => void,
  formData: FormData,
  cepViable: boolean | null
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setLeadData } = useLeadContext();

  const handleFinalizarCadastro = async () => {
    if (!leadId) {
      console.error("Erro: leadId não encontrado");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível finalizar o cadastro. Tente novamente.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Dados do formulário:", formData);
      console.log("Lead ID:", leadId);
      console.log("CEP Viável:", cepViable);

      // Primeiro, atualiza os dados do lead
      console.log("Atualizando lead com os seguintes dados:", {
        status: cepViable ? "aguardando_contratacao" : "lista_espera",
        cpf: formData.cpf?.replace(/\D/g, ""),
        birthDate: formData.birthDate,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        reference: formData.reference,
      });

      const { error: leadError, data: updatedLead } = await supabase
        .from("leads")
        .update({
          status: cepViable ? "aguardando_contratacao" : "lista_espera",
          cpf: formData.cpf?.replace(/\D/g, ""),
          birthDate: formData.birthDate,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          reference: formData.reference,
          updated_at: new Date().toISOString()
        })
        .eq("id", leadId)
        .select();

      if (leadError) {
        console.error("Erro ao atualizar lead:", {
          message: leadError.message,
          details: leadError.details,
          hint: leadError.hint,
          code: leadError.code,
          leadId,
          formData: {
            ...formData,
            cpf: formData.cpf?.replace(/\D/g, ""),
            whatsapp: formData.whatsapp?.replace(/\D/g, ""),
            cep: formData.cep?.replace(/\D/g, "")
          },
          cepViable
        });
        throw leadError;
      }

      console.log("Lead atualizado com sucesso. Dados atualizados:", updatedLead);

      // Busca os dados atualizados do lead
      const { data: leadData, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar dados do lead:", {
          error: fetchError,
          leadId
        });
        throw fetchError;
      }

      console.log("Dados do lead recuperados após atualização:", {
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

      // Se o CEP for viável, cria o registro do cliente
      if (cepViable) {
        console.log("Iniciando criação do registro de cliente...");
        
        // Validação dos dados do plano
        if (!leadData.plantype) {
          console.error("Tipo de plano não encontrado no lead");
          toast({
            variant: "destructive",
            title: "Erro ao finalizar cadastro",
            description: "Tipo de plano não encontrado. Por favor, tente novamente."
          });
          throw new Error("Tipo de plano não encontrado");
        }

        // Validação dos campos obrigatórios
        const requiredFields = {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          cep: formData.cep,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          cpf: formData.cpf
        };

        const missingFields = Object.entries(requiredFields)
          .filter(([_, value]) => !value)
          .map(([field]) => field);

        if (missingFields.length > 0) {
          console.error("Campos obrigatórios faltando:", missingFields);
          toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: `Por favor, preencha os seguintes campos: ${missingFields.map(field => {
              switch(field) {
                case "name": return "nome";
                case "email": return "e-mail";
                case "whatsapp": return "WhatsApp";
                case "cep": return "CEP";
                case "street": return "rua";
                case "city": return "cidade";
                case "state": return "estado";
                case "cpf": return "CPF";
                default: return field;
              }
            }).join(", ")}`
          });
          throw new Error(`Campos obrigatórios faltando: ${missingFields.join(", ")}`);
        }

        // Validação do formato do CPF
        const cpf = formData.cpf?.replace(/\D/g, "");
        if (cpf && cpf.length !== 11) {
          console.error("CPF inválido:", cpf);
          toast({
            variant: "destructive",
            title: "CPF inválido",
            description: "Por favor, insira um CPF válido com 11 dígitos."
          });
          throw new Error("CPF inválido");
        }

        // Validação do formato do WhatsApp
        const whatsapp = formData.whatsapp?.replace(/\D/g, "");
        if (whatsapp && whatsapp.length !== 11) {
          console.error("WhatsApp inválido:", whatsapp);
          toast({
            variant: "destructive",
            title: "WhatsApp inválido",
            description: "Por favor, insira um número de WhatsApp válido com DDD (11 dígitos)."
          });
          throw new Error("WhatsApp inválido");
        }

        // Validação do formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          console.error("E-mail inválido:", formData.email);
          toast({
            variant: "destructive",
            title: "E-mail inválido",
            description: "Por favor, insira um endereço de e-mail válido."
          });
          throw new Error("E-mail inválido");
        }

        // Validação do formato do CEP
        const cep = formData.cep?.replace(/\D/g, "");
        if (cep && cep.length !== 8) {
          console.error("CEP inválido:", cep);
          toast({
            variant: "destructive",
            title: "CEP inválido",
            description: "Por favor, insira um CEP válido com 8 dígitos."
          });
          throw new Error("CEP inválido");
        }

        const customerData = {
          lead_id: leadId,
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp.replace(/\D/g, ""),
          cep: formData.cep?.replace(/\D/g, ""),
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          reference: formData.reference,
          cpf: formData.cpf?.replace(/\D/g, ""),
          birth_date: formData.birthDate,
          plan_type: leadData.plantype,
          business_type: leadData.businesstype,
          status: "aguardando_contratacao"
        };

        console.log("Dados do cliente a serem salvos:", customerData);
        
        const { error: customerError, data: createdCustomer } = await supabase
          .from("customers")
          .insert(customerData)
          .select();

        if (customerError) {
          console.error("Erro ao criar cliente:", {
            message: customerError.message,
            details: customerError.details,
            hint: customerError.hint,
            code: customerError.code,
            customerData
          });
          throw customerError;
        }

        console.log("Cliente criado com sucesso. Detalhes:", {
          customer: createdCustomer,
          leadId,
          status: "aguardando_contratacao"
        });
      }
      
      // Atualiza o contexto com os dados do lead
      console.log("Atualizando contexto do lead com os dados:", leadData);
      setLeadData(leadData);

      // Fecha o modal e reseta o formulário
      onClose();
      resetForm();
      setLeadId(null);
      setCepViable(null);

      // Navega para a página de sucesso
      console.log("Navegando para a página de sucesso com ID:", leadId);
      navigate(`/success?id=${leadId}`);

      toast({
        title: "Cadastro finalizado!",
        description: "Seus dados foram salvos com sucesso. Entraremos em contato em breve.",
      });

    } catch (error) {
      console.error("Erro ao finalizar cadastro:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Houve um problema ao finalizar seu cadastro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      setIsLoading(true);
      
      // Atualiza o lead com o status de lista de espera
      const { error: leadError } = await supabase
        .from("leads")
        .update({
          status: "lista_espera",
          updated_at: new Date().toISOString(),
          // Adiciona os dados de endereço mesmo sem viabilidade
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          reference: formData.reference
        })
        .eq("id", leadId);

      if (leadError) {
        console.error("Erro ao atualizar lead para lista de espera:", leadError);
        throw leadError;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Você foi adicionado à nossa lista de espera. Entraremos em contato quando houver disponibilidade na sua região.",
      });

      onClose();
    } catch (error) {
      console.error("Erro ao adicionar à lista de espera:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFinalizarCadastro,
    handleJoinWaitlist,
  };
};
