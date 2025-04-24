
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Webhook, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookUrlInputProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isEnabled: boolean;
}

export function WebhookUrlInput({ webhookUrl, setWebhookUrl, isEnabled }: WebhookUrlInputProps) {
  const { toast } = useToast();

  const generateWebhookUrl = () => {
    const projectId = "pscsuuvgqiawlkuqlnxm";
    const generatedUrl = `https://${projectId}.supabase.co/functions/v1/webhook-handler`;
    
    setWebhookUrl(generatedUrl);
    
    toast({
      title: "URL do Webhook Gerada",
      description: "URL do webhook preenchida automaticamente.",
    });
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      toast({
        title: "URL Copiada",
        description: "A URL do webhook foi copiada para a área de transferência.",
      });
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="webhook-url">URL do Webhook</Label>
      <div className="flex space-x-2">
        <Input
          id="webhook-url"
          placeholder="https://seu-sistema.com/api/webhook"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={generateWebhookUrl}
          title="Gerar URL do Webhook"
        >
          <Webhook className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={copyWebhookUrl}
          title="Copiar URL do Webhook"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Clique no botão da esquerda para gerar uma URL de webhook automaticamente.
      </p>
    </div>
  );
}
