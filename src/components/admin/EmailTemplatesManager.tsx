
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  type: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export function EmailTemplatesManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    supabase
      .from("email_templates")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast({
            title: "Erro ao carregar templates",
            description: error.message,
            variant: "destructive",
          });
        } else if (data) {
          setTemplates(data as EmailTemplate[]);
        }
        setLoading(false);
      });
  }, [toast]);

  const handleChange = (idx: number, field: keyof EmailTemplate, value: string) => {
    setTemplates((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = async (idx: number) => {
    const template = templates[idx];
    setSavingId(template.id);

    const { error } = await supabase.from("email_templates").upsert(
      {
        id: template.id,
        type: template.type,
        subject: template.subject,
        body: template.body,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    setSavingId(null);

    if (error) {
      toast({
        title: "Erro ao salvar template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Template salvo",
        description: "O template de e-mail foi atualizado.",
        variant: "default",
      });
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-[#2b24a3]">
        Personalização de E-mails
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center p-10 text-gray-600">Carregando...</div>
        ) : (
          templates.map((template, idx) => (
            <Card
              key={template.id}
              className="backdrop-blur-md bg-white/70 border-0 shadow-lg relative flex flex-col"
              style={{
                boxShadow: "0 8px 32px 0 rgba(43,36,163,0.06)",
                border: "1px solid #efeef6",
              }}
            >
              <CardHeader>
                <CardTitle>
                  <Input
                    value={template.type}
                    onChange={(e) => handleChange(idx, "type", e.target.value)}
                    className="bg-white/90 border border-[#efeef6] rounded-lg text-[#2b24a3] font-semibold text-base px-4 py-2"
                    disabled={savingId === template.id}
                    aria-label="Tipo do template"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 min-h-[300px] gap-5">
                <div>
                  <label className="text-[#2b24a3] font-medium text-sm mb-1 block">
                    Assunto
                  </label>
                  <Input
                    value={template.subject}
                    onChange={(e) => handleChange(idx, "subject", e.target.value)}
                    className="bg-white/80 border border-[#efeef6] rounded-lg text-black px-4 py-2"
                    disabled={savingId === template.id}
                    aria-label="Assunto do template"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="text-[#2b24a3] font-medium text-sm mb-1 block">
                    HTML do E-mail
                  </label>
                  <Textarea
                    value={template.body}
                    onChange={(e) => handleChange(idx, "body", e.target.value)}
                    className="bg-white/80 border border-[#efeef6] rounded-lg text-sm text-black font-mono min-h-[150px] flex-1 resize-y"
                    rows={8}
                    spellCheck={false}
                    disabled={savingId === template.id}
                    aria-label="HTML do template"
                  />
                </div>
                <Button
                  type="button"
                  style={{
                    background: "#db451c",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                  className="w-fit mt-2 px-8 py-2 rounded-lg shadow flex items-center gap-2 text-base hover:bg-[#b53915] transition"
                  disabled={savingId === template.id}
                  onClick={() => handleSave(idx)}
                >
                  {savingId === template.id ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-8 opacity-80">
        Use <span className="bg-[#efeef6] text-[#2b24a3] px-1 py-0.5 rounded font-mono text-[0.97em]">{`{{variavel}}`}</span> para interpolar variáveis dinamicamente nos templates.
      </div>
    </section>
  );
}
