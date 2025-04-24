
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Webhook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface N8nSettings {
  webhook_url: string;
  webhook_token: string;
  webhook_enabled: boolean;
}

export function N8nIntegration() {
  const [settings, setSettings] = useState<N8nSettings>({
    webhook_url: "",
    webhook_token: "",
    webhook_enabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data: webhookUrl } = await supabase
        .from('settings')
        .select('valor')
        .eq('chave', 'webhook_url')
        .maybeSingle();

      const { data: webhookToken } = await supabase
        .from('settings')
        .select('valor')
        .eq('chave', 'webhook_token')
        .maybeSingle();

      const { data: webhookEnabled } = await supabase
        .from('settings')
        .select('valor')
        .eq('chave', 'webhook_enabled')
        .maybeSingle();

      setSettings({
        webhook_url: webhookUrl?.valor || "",
        webhook_token: webhookToken?.valor || "",
        webhook_enabled: webhookEnabled?.valor === "true"
      });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setSettings(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      webhook_enabled: checked
    }));
  };

  const saveSettings = async () => {
    if (!settings.webhook_url && settings.webhook_enabled) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL de webhook para ativar a integração.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save webhook_url
      await supabase
        .from('settings')
        .upsert({ 
          chave: 'webhook_url', 
          valor: settings.webhook_url 
        });

      // Save webhook_token
      await supabase
        .from('settings')
        .upsert({ 
          chave: 'webhook_token', 
          valor: settings.webhook_token 
        });

      // Save webhook_enabled
      await supabase
        .from('settings')
        .upsert({ 
          chave: 'webhook_enabled', 
          valor: settings.webhook_enabled ? "true" : "false" 
        });

      toast({
        title: "Configurações salvas",
        description: settings.webhook_enabled 
          ? "Integração com n8n ativada com sucesso."
          : "Integração com n8n desativada.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações do n8n.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!settings.webhook_url) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL de webhook para testar.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      // Prepare test data
      const testData = {
        id: "12345-test-id",
        name: "Cliente de Teste",
        email: "teste@example.com",
        whatsapp: "(21) 99999-9999",
        address: {
          cep: "12345-678",
          street: "Rua de Teste",
          number: "123",
          complement: "Apto 101",
          neighborhood: "Bairro Teste",
          city: "Rio de Janeiro",
          state: "RJ"
        },
        status: "viable",
        planType: "residential",
        timestamp: new Date().toISOString()
      };

      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      // Add authorization header if token exists
      if (settings.webhook_token) {
        headers['Authorization'] = `Bearer ${settings.webhook_token}`;
      }

      // Send test request
      const response = await fetch(settings.webhook_url, {
        method: 'POST',
        headers,
        body: JSON.stringify(testData),
        mode: 'no-cors' // This is important for cross-origin requests
      });

      // Since we're using no-cors, we can't access the response status
      // We'll assume it worked and show a success message
      toast({
        title: "Teste enviado",
        description: "Um payload de teste foi enviado para o webhook configurado.",
      });
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao testar o webhook. Verifique o console para mais detalhes.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Integração com n8n (Webhook)
        </CardTitle>
        <CardDescription>
          Configure a integração com n8n para automatizar o fluxo de dados quando leads tiverem viabilidade confirmada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook_url">
              Webhook URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="webhook_url"
              name="webhook_url"
              value={settings.webhook_url}
              onChange={handleInputChange}
              placeholder="https://n8n.seudominio.com/webhook/..."
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL do webhook no n8n que receberá os dados dos leads
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook_token">Token (opcional)</Label>
            <Input
              id="webhook_token"
              name="webhook_token"
              type="password"
              value={settings.webhook_token}
              onChange={handleInputChange}
              placeholder="Token de autenticação (opcional)"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Se informado, será enviado como "Authorization: Bearer [token]"
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="webhook_enabled"
              checked={settings.webhook_enabled} 
              onCheckedChange={handleSwitchChange}
              disabled={isLoading}
            />
            <Label htmlFor="webhook_enabled">Ativar envio automático</Label>
          </div>
          
          <div className="p-3 bg-muted rounded-md text-sm">
            <h4 className="font-medium mb-2">Como funciona?</h4>
            <p>
              Quando um lead tiver sua viabilidade confirmada, seus dados completos serão enviados 
              automaticamente para o webhook configurado acima. Os dados são enviados em formato JSON 
              via método POST.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={testWebhook} 
          disabled={!settings.webhook_url || isLoading || isTesting}
        >
          {isTesting ? "Enviando..." : "Enviar Teste"}
        </Button>
        <Button 
          onClick={saveSettings} 
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Configuração"}
        </Button>
      </CardFooter>
    </Card>
  );
}
