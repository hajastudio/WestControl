
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { webhookService } from "@/services/webhookService";

export function useWebhook() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [webhookMethod, setWebhookMethod] = useState<'POST' | 'GET'>('POST');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWebhookConfig = async () => {
      const { data, error } = await supabase
        .from('configurations')
        .select('webhook_url')
        .single();
      
      if (data && data.webhook_url) {
        setWebhookUrl(data.webhook_url);
        setIsEnabled(true);
        
        if (data.webhook_url.includes('method=get')) {
          setWebhookMethod('GET');
        }
      }
    };

    fetchWebhookConfig();
  }, []);

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL não definida",
        description: "Por favor, insira uma URL de webhook válida.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (webhookMethod === 'GET') {
        await webhookService.testWebhook(webhookUrl, 'GET');
        toast({
          title: "Teste GET enviado",
          description: "O teste do webhook via GET foi enviado. Por favor, verifique a recepção no seu sistema.",
        });
      } else {
        await webhookService.testWebhook(webhookUrl);
        toast({
          title: "Teste POST enviado",
          description: "O teste do webhook via POST foi enviado. Por favor, verifique a recepção no seu sistema.",
        });
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar o teste do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebhookConfig = async () => {
    setIsLoading(true);
    
    try {
      let finalUrl = webhookUrl;
      if (webhookMethod === 'GET' && !finalUrl.includes('method=')) {
        finalUrl = finalUrl + (finalUrl.includes('?') ? '&' : '?') + 'method=get';
      }
      
      const { error } = await webhookService.saveWebhookConfig(finalUrl, isEnabled);
      
      if (error) throw error;
      
      toast({
        title: "Configuração salva",
        description: isEnabled 
          ? `Automatização de leads ativada com sucesso via ${webhookMethod}.` 
          : "Automatização de leads desativada.",
      });
    } catch (error) {
      console.error('Erro ao salvar webhook:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    webhookUrl,
    setWebhookUrl,
    isEnabled,
    setIsEnabled,
    webhookMethod,
    setWebhookMethod,
    isLoading,
    testWebhook,
    saveWebhookConfig
  };
}
