import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type CoverageRow = {
  cep: string;
  rua: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};
type SimpleRow = { cep: string; rua?: string };

export function CoverageAreasUploader() {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });
  const [importErrors, setImportErrors] = useState<{ cep: string; message: string }[]>([]);
  const [searchCep, setSearchCep] = useState("");
  const [searchResult, setSearchResult] = useState<CoverageRow | null>(null);
  const [lastRows, setLastRows] = useState<CoverageRow[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const fetchLastRows = async () => {
    const { data, error } = await supabase
      .from("coverage_areas")
      .select("cep, rua, bairro, cidade, estado")
      .order("id", { ascending: false })
      .limit(5);

    if (data && Array.isArray(data)) {
      setLastRows(
        data.map((d: any) => ({
          cep: d.cep ?? "",
          rua: d.rua ?? "",
          bairro: d.bairro ?? "",
          cidade: d.cidade ?? "",
          estado: d.estado ?? "",
        }))
      );
    }
    if (error) {
      console.error("Erro ao buscar últimas linhas:", error);
    }
  };

  useEffect(() => {
    fetchLastRows();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResult(null);

    if (!searchCep) return;

    const { data } = await supabase
      .from("coverage_areas")
      .select("cep, rua, bairro, cidade, estado")
      .ilike("cep", searchCep.trim())
      .maybeSingle();

    if (data) {
      setSearchResult({
        cep: data.cep ?? "",
        rua: data.rua ?? "",
        bairro: data.bairro ?? "",
        cidade: data.cidade ?? "",
        estado: data.estado ?? "",
      });
    } else {
      setSearchResult(null);
    }
  };

  async function processInBatches<T, R>(
    items: T[],
    batchSize: number,
    processor: (item: T, idx: number) => Promise<R>
  ): Promise<PromiseSettledResult<R>[]> {
    let results: PromiseSettledResult<R>[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((item, idx) => processor(item, i + idx))
      );
      results = results.concat(batchResults);
    }
    return results;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    setImportErrors([]);
    setImportProgress({ total: 0, done: 0 });

    try {
      const content = await file.text();
      let ceps = content
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .flatMap(l => l.split(/[;,]/))
        .map(c => c.replace(/\D/g, ""))
        .filter(c => c.length === 8);

      ceps = Array.from(new Set(ceps));
      setImportProgress({ total: ceps.length, done: 0 });

      if (ceps.length === 0) {
        toast({
          variant: "destructive",
          title: "CSV inválido",
          description: "Nenhum CEP válido encontrado no arquivo."
        });
        setIsImporting(false);
        return;
      }

      const importErrors: { cep: string; message: string }[] = [];
      let doneCount = 0;
      const batchSize = 5;

      await processInBatches<string, void>(
        ceps,
        batchSize,
        async (cep) => {
          try {
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await resp.json();
            if (data.erro) {
              importErrors.push({ cep, message: "CEP não encontrado na ViaCEP" });
              return;
            }
            const row = {
              cep: data.cep?.replace(/\D/g, ""),
              rua: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
            };

            const { error } = await supabase.from("coverage_areas").upsert(row);
            if (error) {
              importErrors.push({ cep, message: error.message });
            }
          } catch (err: any) {
            importErrors.push({ cep, message: err?.message || "Erro desconhecido ao requisitar ViaCEP" });
          } finally {
            doneCount++;
            setImportProgress(p => ({ ...p, done: doneCount }));
          }
        }
      );

      if (importErrors.length === 0) {
        toast({ title: "Importação finalizada com sucesso!", description: `Todos os ${ceps.length} CEPs importados.` });
      } else {
        toast({
          variant: "destructive",
          title: "Importação finalizada com erro",
          description: `Alguns CEPs não puderam ser processados corretamente.`,
        });
      }
      setImportErrors(importErrors);
      fetchLastRows();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao importar CSV",
        description: error.message || "Falha desconhecida ao importar CSV"
      });
    }
    setIsImporting(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <Card className="backdrop-blur-lg bg-white/60 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#db451c]">Importar Endereços com Viabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="hidden"
            ref={inputRef}
            id="csv-import-coverage"
          />
          <label htmlFor="csv-import-coverage">
            <Button asChild className="bg-[#db451c] hover:bg-[#b93e19] text-white">
              <span>{isImporting ? "Importando..." : "Selecionar arquivo CSV"}</span>
            </Button>
          </label>
          <p className="text-xs text-gray-700 mt-2">
            O arquivo deve conter uma coluna <b>cep</b> (ou CEPs separados por ponto e vírgula, quebra de linha ou vírgula).
            <br />
            Exemplo: <code>21741110</code>
            <br />
            Cada CEP será consultado na base oficial ViaCEP, retornando logradouro, bairro, cidade e UF.
          </p>
          {isImporting && (
            <div className="mt-2">
              <div className="text-sm">{importProgress.done} / {importProgress.total} CEPs processados</div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-[#db451c] h-2 rounded transition-all"
                  style={{ width: `${(importProgress.done / (importProgress.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
          {importErrors.length > 0 &&
            <div className="mt-3">
              <div className="text-sm text-red-600 font-bold">Erros encontrados:</div>
              <ul className="text-xs text-red-700 pl-4 list-disc mt-1 space-y-1 max-h-44 overflow-y-auto">
                {importErrors.map((row, idx) => (
                  <li key={idx}>{row.cep}: {row.message}</li>
                ))}
              </ul>
            </div>
          }
        </CardContent>
      </Card>

      <Card className="backdrop-blur-lg bg-white/60 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Busca Manual por CEP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 items-center">
            <Input
              type="text"
              placeholder="Digite o CEP (ex: 21741-110)"
              value={searchCep}
              onChange={e => setSearchCep(e.target.value)}
              className="max-w-xs"
            />
            <Button
              variant="secondary"
              type="submit"
              disabled={!searchCep.length}
            >
              Buscar
            </Button>
          </form>
          {searchResult && (
            <div className="mt-2 text-sm text-green-700 font-mono">
              <b>CEP:</b> {searchResult.cep} <b>Rua:</b> {searchResult.rua}
              {searchResult.bairro && <> <b>Bairro:</b> {searchResult.bairro}</>}
              {searchResult.cidade && <> <b>Cidade:</b> {searchResult.cidade}</>}
              {searchResult.estado && <> <b>UF:</b> {searchResult.estado}</>}
            </div>
          )}
          {!searchResult && searchCep && (
            <div className="mt-2 text-sm text-red-700">
              Nenhum registro encontrado para o CEP informado.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-lg bg-white/60 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Últimos 5 registros importados</CardTitle>
        </CardHeader>
        <CardContent>
          {lastRows.length === 0 ? (
            <span className="text-gray-500 text-sm">Nenhum registro encontrado.</span>
          ) : (
            <ul className="divide-y divide-gray-200">
              {lastRows.map((row, idx) => (
                <li key={idx} className="py-2 flex flex-wrap md:flex-nowrap justify-between gap-2 font-mono">
                  <span>
                    {row.rua}
                    {row.bairro && <>, {row.bairro}</>}
                    {row.cidade && <>, {row.cidade}</>}
                    {row.estado && <> - {row.estado}</>}
                  </span>
                  <span className="text-green-800">{row.cep}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
