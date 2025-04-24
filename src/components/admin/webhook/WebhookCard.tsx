
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Webhook } from "lucide-react";
import { WebhookUrlInput } from "./WebhookUrlInput";
import { WebhookControls } from "./WebhookControls";
import { WebhookDataFormat } from "./WebhookDataFormat";
import { WebhookTip } from "./WebhookTip";
import { useWebhook } from "@/hooks/useWebhook";

export function WebhookCard() {
  const {
    webhookUrl,
    setWebhookUrl,
    isEnabled,
    setIsEnabled,
    webhookMethod,
    setWebhookMethod,
    isLoading,
    testWebhook,
    saveWebhookConfig
  } = useWebhook();

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
            
            <WebhookTip webhookMethod={webhookMethod} />
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
