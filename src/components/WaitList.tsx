
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useLeadContext } from "@/context/LeadContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function WaitList() {
  const { leadData } = useLeadContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Verificar se o lead já está salvo na waitlist
  useEffect(() => {
    const checkIfLeadExists = async () => {
      if (!leadData.email || !leadData.whatsapp) {
        setCheckingStatus(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("email", leadData.email)
          .eq("whatsapp", leadData.whatsapp?.replace(/\D/g, ""))
          .maybeSingle();

        if (error) {
          console.error("Error checking lead status:", error);
        } else if (data) {
          // Lead já existe, atualizar a interface
          setHasJoined(true);
        }
      } catch (err) {
        console.error("Error in lead check:", err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkIfLeadExists();
  }, [leadData.email, leadData.whatsapp]);

  const handleJoinWaitlist = async () => {
    if (hasJoined) {
      toast({
        title: "Informação",
        description: "Você já está na nossa lista de espera."
      });
      return;
    }

    if (!leadData.name || !leadData.email || !leadData.whatsapp) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos necessários.",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    
    try {
      // Verificar se já existe um lead com este email/whatsapp
      const { data: existingLead } = await supabase
        .from("leads")
        .select("*")
        .eq("email", leadData.email)
        .eq("whatsapp", leadData.whatsapp?.replace(/\D/g, ""))
        .maybeSingle();

      if (existingLead) {
        // Se já existe, apenas atualiza o status
        const { error: updateError } = await supabase
          .from("leads")
          .update({ status: "waitlist" })
          .eq("id", existingLead.id);
          
        if (updateError) throw updateError;
      } else {
        // Se não existe, cria um novo lead
        const { error } = await supabase
          .from("leads")
          .insert({
            name: leadData.name,
            email: leadData.email,
            whatsapp: leadData.whatsapp?.replace(/\D/g, ""),
            cep: leadData.cep?.replace(/\D/g, ""),
            status: "waitlist"
          });
        
        if (error) throw error;
      }
      
      // Exibe mensagem de sucesso
      toast({
        title: "Sucesso!",
        description: "Você foi adicionado à lista de espera."
      });
      
      setHasJoined(true);
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar você à lista de espera. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="py-12 bg-brand-gray/30">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
              </div>
              <p>Verificando status...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-gray/30">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-brand-yellow/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-yellow" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M12.75 7C12.75 6.59 12.41 6.25 12 6.25C11.59 6.25 11.25 6.59 11.25 7V12.43C11.25 12.78 11.45 13.11 11.78 13.27L15.28 15.05C15.43 15.13 15.59 15.16 15.75 15.16C16.04 15.16 16.31 15.02 16.47 14.77C16.7 14.4 16.59 13.91 16.22 13.69L12.75 11.93V7Z" fill="currentColor"/>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Ops! Ainda não chegamos lá.</h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Infelizmente ainda não temos cobertura na sua região para o CEP <span className="font-semibold">{leadData.cep || "informado"}</span>.
            </p>
            
            {hasJoined ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-xl mb-2">Você está na lista de espera!</h3>
                <p>
                  Entraremos em contato assim que nossa rede estiver disponível na sua região. Obrigado pelo interesse!
                </p>
              </div>
            ) : (
              <div className="bg-brand-blue/10 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-xl mb-2">Entre na nossa lista de espera</h3>
                <p>
                  Estamos em constante expansão! Deixe seus dados para avisarmos quando chegarmos na sua região.
                </p>
              </div>
            )}
            
            {!hasJoined ? (
              <Button 
                onClick={handleJoinWaitlist}
                disabled={isJoining}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 py-6 text-lg"
              >
                {isJoining ? "Processando..." : "Entrar na Lista de Espera"}
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/")}
                className="w-full bg-brand-gray/80 hover:bg-brand-gray py-6 text-lg"
              >
                Voltar para a Página Inicial
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default WaitList;
