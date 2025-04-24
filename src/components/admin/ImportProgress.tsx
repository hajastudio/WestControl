
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export function ImportProgress({ importId }: { importId: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('import_logs')
        .select('processed_rows, total_rows, status')
        .eq('id', importId)
        .single();

      if (data) {
        const percentage = data.total_rows > 0 
          ? (data.processed_rows / data.total_rows) * 100 
          : 0;
        setProgress(percentage);
        setStatus(data.status);
      }
    };

    const channel = supabase
      .channel('import-progress')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'import_logs',
          filter: `id=eq.${importId}`
        },
        (payload: any) => {
          const { processed_rows, total_rows, status } = payload.new;
          const percentage = total_rows > 0 
            ? (processed_rows / total_rows) * 100 
            : 0;
          setProgress(percentage);
          setStatus(status);
        }
      )
      .subscribe();

    fetchProgress();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [importId]);

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-500">
        Status: {status} - {Math.round(progress)}% concluído
      </p>
    </div>
  );
}
