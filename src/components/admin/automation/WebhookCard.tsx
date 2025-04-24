
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Webhook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WebhookUrlInput } from "../webhook/WebhookUrlInput";
import { WebhookControls } from "../webhook/WebhookControls";
import { WebhookDataFormat } from "../webhook/WebhookDataFormat";
import { webhookService } from "@/services/webhookService";

export function WebhookCard() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Automação de Leads
        </CardTitle>
        <CardDescription>
          Configure um webhook para automaticamente notificar sistemas externos quando um lead tem viabilidade aprovada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <WebhookControls 
          isEnabled={isEnabled} 
          setIsEnabled={setIsEnabled}
          webhookMethod={webhookMethod}
          setWebhookMethod={setWebhookMethod}
        />
        
        {isEnabled && (
          <div className="space-y-4">
            <WebhookUrlInput 
              webhookUrl={webhookUrl} 
              setWebhookUrl={setWebhookUrl}
              isEnabled={isEnabled}
            />
            
            <div className="p-3 bg-muted rounded-md text-sm">
              <h4 className="font-medium mb-2">Dica para teste de webhook:</h4>
              {webhookMethod === 'GET' ? (
                <p>
                  Para testar webhooks com GET, você pode usar um serviço como <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">webhook.site</a> ou 
                  configurar qualquer endpoint que aceite requisições GET.
                </p>
              ) : (
                <p>
                  Para testar webhooks com POST, você pode usar um serviço como <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">webhook.site</a> para 
                  receber e visualizar os dados enviados.
                </p>
              )}
            </div>
            
            <WebhookDataFormat />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={testWebhook} 
          disabled={!isEnabled || !webhookUrl || isLoading}
        >
          Testar Webhook via {webhookMethod}
        </Button>
        <Button onClick={saveWebhookConfig} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configuração"}
        </Button>
      </CardFooter>
    </Card>
  );
}
