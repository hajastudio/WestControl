
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppConfigProps {
  configurations: {
    whatsapp_number: string;
    webhook_url: string;
    default_message: string;
  };
  onConfigUpdate: (config: any) => void;
}

export function WhatsAppConfig({ configurations, onConfigUpdate }: WhatsAppConfigProps) {
  const { toast } = useToast();

  const saveConfigurations = async () => {
    const currentDateISO = new Date().toISOString();

    const { error } = await supabase
      .from('configurations')
      .update({
        ...configurations,
        updated_at: currentDateISO
      })
      .single();

    if (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label>Número do WhatsApp</label>
        <Input 
          value={configurations.whatsapp_number}
          onChange={(e) => onConfigUpdate({
            ...configurations, 
            whatsapp_number: e.target.value
          })}
        />
      </div>
      <div>
        <label>URL do Webhook do Twilio</label>
        <Input 
          value={configurations.webhook_url}
          onChange={(e) => onConfigUpdate({
            ...configurations, 
            webhook_url: e.target.value
          })}
        />
      </div>
      <div>
        <label>Mensagem Padrão</label>
        <Textarea 
          value={configurations.default_message}
          onChange={(e) => onConfigUpdate({
            ...configurations, 
            default_message: e.target.value
          })}
          placeholder="Use {{nome}} e {{cep}} como variáveis"
        />
      </div>
      <Button onClick={saveConfigurations}>Salvar Configurações</Button>
    </div>
  );
}
