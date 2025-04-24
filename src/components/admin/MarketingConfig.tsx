
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const marketingConfigSchema = z.object({
  seo_title: z.string(),
  seo_description: z.string(),
  seo_keywords: z.string(),
  seo_og_image: z.string(),
  favicon: z.string(),
  tracking_enabled: z.boolean(),
  meta_pixel_id: z.string(),
  gtm_id: z.string(),
  custom_scripts: z.string(),
});

type MarketingConfigForm = z.infer<typeof marketingConfigSchema>;

export function MarketingConfig() {
  const { toast } = useToast();
  const form = useForm<MarketingConfigForm>({
    resolver: zodResolver(marketingConfigSchema),
    defaultValues: {
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      seo_og_image: "",
      favicon: "",
      tracking_enabled: true,
      meta_pixel_id: "",
      gtm_id: "",
      custom_scripts: "",
    },
  });

  React.useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("marketing_config")
        .select("*")
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as configurações.",
        });
        return;
      }

      if (data) {
        form.reset(data);
      }
    };

    fetchConfig();
  }, [form, toast]);

  const onSubmit = async (values: MarketingConfigForm) => {
    const { error } = await supabase
      .from("marketing_config")
      .update(values)
      .eq("id", (await supabase.from("marketing_config").select("id").single()).data?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing & SEO</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="seo_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título SEO</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      O título que aparecerá nos resultados de busca.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seo_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição SEO</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      A descrição que aparecerá nos resultados de busca.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seo_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palavras-chave</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Palavras-chave separadas por vírgula.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seo_og_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem OG</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      URL da imagem para compartilhamento em redes sociais.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      URL do favicon do site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tracking_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Ativar Rastreamento
                      </FormLabel>
                      <FormDescription>
                        Ativa ou desativa todos os scripts de rastreamento.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_pixel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Pixel ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      ID do Meta Pixel para rastreamento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gtm_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Tag Manager ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      ID do Google Tag Manager.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custom_scripts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scripts Personalizados</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormDescription>
                      Scripts personalizados para serem inseridos no head do site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Salvar Configurações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
