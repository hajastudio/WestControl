
import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function CepUploader() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importId, setImportId] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Erro no arquivo",
        description: "Por favor, selecione um arquivo CSV."
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      toast({
        title: "Iniciando upload",
        description: "Preparando para enviar o arquivo CSV..."
      });

      // First create an import log entry
      const { data: importLog, error: importError } = await supabase
        .from('import_logs')
        .insert([{
          filename: fileName,
          status: 'uploading',
          processed_rows: 0,
          total_rows: 0
        }])
        .select()
        .single();

      if (importError) throw importError;

      setImportId(importLog.id);
      console.log("Import log created:", importLog.id);

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('viability-csv')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      console.log("File uploaded successfully to:", filePath);

      // Call edge function to process the CSV
      const { data: processingData, error: processingError } = await supabase.functions
        .invoke('process-cep-csv', {
          body: { filename: fileName, import_id: importLog.id }
        });

      if (processingError) {
        console.error("Edge function error:", processingError);
        throw new Error(`Erro ao processar o arquivo: ${processingError.message}`);
      }

      console.log("Edge function response:", processingData);

      // Start monitoring the import progress
      const channel = supabase
        .channel('import-progress')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'import_logs',
            filter: `id=eq.${importLog.id}`
          },
          (payload: any) => {
            console.log("Import log update:", payload);
            const { processed_rows, total_rows, status, error_message } = payload.new;
            
            if (total_rows > 0) {
              const progressPercentage = (processed_rows / total_rows) * 100;
              console.log(`Progress: ${processed_rows}/${total_rows} (${progressPercentage.toFixed(1)}%)`);
              setProgress(progressPercentage);
            }
            
            if (status === 'completed') {
              toast({
                title: "Importação concluída",
                description: `${processed_rows} CEPs foram importados com sucesso.`
              });
              setIsUploading(false);
              setProgress(0);
              setImportId(null);
              supabase.removeChannel(channel);
            } else if (status === 'error') {
              toast({
                variant: "destructive",
                title: "Erro na importação",
                description: error_message || "Houve um erro ao processar o arquivo. Tente novamente."
              });
              setIsUploading(false);
              setProgress(0);
              setImportId(null);
              supabase.removeChannel(channel);
            }
          }
        )
        .subscribe();

      toast({
        title: "Arquivo enviado",
        description: "O arquivo CSV está sendo processado."
      });

      // Cleanup subscription after 5 minutes if it hasn't completed
      setTimeout(() => {
        if (isUploading) {
          supabase.removeChannel(channel);
          setIsUploading(false);
          setProgress(0);
          setImportId(null);
          toast({
            variant: "destructive",
            title: "Tempo esgotado",
            description: "A importação demorou muito tempo. Verifique o status no painel de administração."
          });
        }
      }, 300000);

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
      setIsUploading(false);
      setProgress(0);
      
      // Try to update status to error if we have an import ID
      if (importId) {
        await supabase
          .from('import_logs')
          .update({
            status: 'error',
            error_message: error instanceof Error ? error.message : "Erro desconhecido"
          })
          .eq('id', importId);
      }
    }
  };

  return (
    <div className="border-dashed border-2 p-6 text-center rounded-lg">
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload} 
        className="hidden" 
        id="csv-upload"
        disabled={isUploading}
      />
      <label 
        htmlFor="csv-upload" 
        className="cursor-pointer flex flex-col items-center justify-center gap-2"
      >
        {!isUploading ? (
          <>
            <Upload className="h-8 w-8 text-gray-500" />
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Selecionar arquivo CSV de Viabilidade</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              O arquivo deve conter as colunas: CEP, Endereço
            </p>
          </>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium">Processando arquivo...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">
              {progress.toFixed(0)}% concluído
            </p>
          </div>
        )}
      </label>
    </div>
  );
}
