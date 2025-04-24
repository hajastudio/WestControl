
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

// Utilitário para validar número WhatsApp
function isValidWhatsApp(number: string) {
  return number.startsWith("whatsapp:");
}

// Função para envio real (mock caso dados incompletos)
async function sendWhatsAppMessage({ sid, token, from, to, body }: {
  sid: string,
  token: string,
  from: string,
  to: string,
  body: string,
}): Promise<any> {
  const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const formData = new URLSearchParams();
  formData.append("From", from);
  formData.append("To", to);
  formData.append("Body", body);

  const resp = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${sid}:${token}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || "Erro desconhecido");
  }
  return data;
}

const initialState = {
  twilio_sid: "",
  twilio_token: "",
  twilio_from_number: "",
  twilio_to_number: "",
  twilio_enabled: "false",
};

export function TwilioWhatsAppTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(initialState);

  // Busca configs da tabela settings
  useEffect(() => {
    const fetchSettings = async () => {
      const keys = [
        "twilio_sid",
        "twilio_token",
        "twilio_from_number",
        "twilio_to_number",
        "twilio_enabled"
      ];
      const { data, error } = await supabase
        .from('settings')
        .select('chave, valor')
        .in('chave', keys);

      if (data) {
        const newConfig = { ...initialState };
        data.forEach((row: any) => {
          newConfig[row.chave] = row.valor || "";
        });
        setSettings(newConfig);
      }
      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar configurações do Twilio.",
          variant: "destructive",
        });
      }
    };
    fetchSettings();
  }, [toast]);

  const onChangeField = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: typeof value === "boolean" ? (value ? "true" : "false") : value,
    }));
  };

  const saveSettings = async () => {
    setLoading(true);

    // Validações obrigatórias
    if (!settings.twilio_sid || !settings.twilio_token || !settings.twilio_from_number || !settings.twilio_to_number) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos devem ser preenchidos.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    if (!isValidWhatsApp(settings.twilio_from_number) || !isValidWhatsApp(settings.twilio_to_number)) {
      toast({
        title: "Formato WhatsApp inválido",
        description: "Os números devem começar com 'whatsapp:'.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Salva/atualiza cada configuração
    try {
      for (const key of Object.keys(settings)) {
        await supabase.from('settings')
          .upsert({ chave: key, valor: settings[key as keyof typeof settings] }, { onConflict: 'chave' });
      }
      toast({ title: "Sucesso", description: "Configurações salvas!" });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  async function handleTest() {
    // Validação dos campos
    if (!settings.twilio_sid || !settings.twilio_token || !settings.twilio_from_number || !settings.twilio_to_number) {
      toast({
        title: "Preencha todos os campos",
        description: "Informe todos os campos obrigatórios para testar.",
        variant: "destructive",
      });
      return;
    }
    if (!isValidWhatsApp(settings.twilio_from_number) || !isValidWhatsApp(settings.twilio_to_number)) {
      toast({
        title: "Formato WhatsApp inválido",
        description: "Os números devem começar com 'whatsapp:'.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mensagem mockada
      await sendWhatsAppMessage({
        sid: settings.twilio_sid,
        token: settings.twilio_token,
        from: settings.twilio_from_number,
        to: settings.twilio_to_number,
        body: "🚀 Teste de integração Twilio WhatsApp! Mensagem enviada com sucesso.",
      });
      toast({
        title: "Teste enviado com sucesso",
        description: "Mensagem de teste enviada via Twilio!",
      });
    } catch (e: any) {
      toast({
        title: "Erro ao enviar teste",
        description: e?.message || "Falha desconhecida ao enviar mensagem.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card className="backdrop-blur-lg bg-white/70 border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Twilio WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">SID da Conta Twilio *</label>
            <Input
              value={settings.twilio_sid}
              onChange={e => onChangeField("twilio_sid", e.target.value)}
              placeholder="Ex: ACXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Auth Token Twilio *</label>
            <Input
              type="password"
              value={settings.twilio_token}
              onChange={e => onChangeField("twilio_token", e.target.value)}
              placeholder="Seu Auth Token"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Número de Origem (From) *</label>
            <Input
              value={settings.twilio_from_number}
              onChange={e => onChangeField("twilio_from_number", e.target.value)}
              placeholder="whatsapp:+14155238886"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Número do Atendente (To) *</label>
            <Input
              value={settings.twilio_to_number}
              onChange={e => onChangeField("twilio_to_number", e.target.value)}
              placeholder="whatsapp:+55XXXXXXXXXXX"
              required
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Switch
              checked={settings.twilio_enabled === "true"}
              onCheckedChange={v => onChangeField("twilio_enabled", v)}
              id="twilio-enabled-toggle"
            />
            <label htmlFor="twilio-enabled-toggle" className="cursor-pointer">
              Ativar Envio Automático
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={saveSettings} disabled={loading}>
            Salvar Configurações
          </Button>
          <Button type="button" variant="outline" onClick={handleTest} disabled={loading}>
            Enviar mensagem de teste
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Função a ser chamada sempre que um lead completar o checkout, se o envio automático estiver ativado.
export async function sendWhatsAppCheckout(leadData: any) {
  // Busca configs do Twilio
  const keys = [
    "twilio_sid",
    "twilio_token",
    "twilio_from_number",
    "twilio_to_number",
    "twilio_enabled"
  ];
  const { data } = await supabase.from('settings').select('chave, valor').in('chave', keys);

  if (!data) return;
  const settings: any = {};
  data.forEach((row: any) => {
    settings[row.chave] = row.valor || "";
  });

  if (settings.twilio_enabled !== "true") return;

  // Monta a mensagem com dados do lead
  const msg = `Olá ${leadData.name}! Seu pedido foi cadastrado com sucesso.\nResumo:\nNome: ${leadData.name}\nPlano: ${leadData.planType}\nEndereço: ${leadData.street}, ${leadData.number} - ${leadData.city}/${leadData.state}\nContato: ${leadData.whatsapp}\nEm breve entraremos em contato para agendar sua instalação.`;

  try {
    await sendWhatsAppMessage({
      sid: settings.twilio_sid,
      token: settings.twilio_token,
      from: settings.twilio_from_number,
      to: settings.twilio_to_number,
      body: msg,
    });
    // Você pode usar um toast aqui ou logs se necessário
  } catch (e: any) {
    // Tratar/logar erro silenciosamente, opcionalmente reportar
    // Ex: toast({ title: "Falha no envio WhatsApp", description: e.message, variant: "destructive" });
  }
}
