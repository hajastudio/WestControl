
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

function isValidHttpUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function WebhookSettingsCard() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load webhook URL from settings table
  useEffect(() => {
    const fetchWebhookUrl = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("valor")
        .eq("chave", "webhook_url")
        .maybeSingle();

      if (error) {
        toast({
          title: "Erro ao buscar configuração",
          description: error.message,
          variant: "destructive",
        });
      } else if (data && data.valor) {
        setWebhookUrl(data.valor);
      }
      setLoading(false);
    };
    fetchWebhookUrl();
  }, []);

  const handleSave = async () => {
    if (!isValidHttpUrl(webhookUrl)) {
      toast({
        title: "URL inválida",
        description: "Digite uma URL válida iniciando com http:// ou https://",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from("settings")
      .upsert({ 
        chave: "webhook_url", 
        valor: webhookUrl 
      });

    setSaving(false);

    if (error) {
      toast({
        title: "Erro ao salvar URL",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Configuração salva",
        description: "O Webhook URL foi atualizado com sucesso.",
        variant: "default",
      });
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/70 border-0 shadow-lg">
      <CardHeader>
        <CardTitle>
          <span className="text-[#2b24a3] text-xl flex items-center gap-2">
            <LinkIcon className="h-6 w-6 opacity-80" />
            Configurações de Webhook
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2b24a3] opacity-80">
              <LinkIcon className="h-5 w-5" />
            </span>
            <Input
              className="pl-12 pr-4 py-3 text-base font-medium shadow-inner bg-white/70 border border-[#efeef6] focus:border-[#2b24a3] rounded-lg transition-all placeholder-gray-400"
              placeholder="https://meu-webhook.com/api"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={loading || saving}
              type="url"
              autoComplete="off"
              spellCheck={false}
              required
              aria-label="Webhook URL"
            />
          </div>
          <Button
            type="submit"
            className="w-fit bg-[#2b24a3] hover:bg-[#1a1748] text-white font-semibold px-8 py-2 rounded-lg shadow"
            disabled={saving || loading}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
