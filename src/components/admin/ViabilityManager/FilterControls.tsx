
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FilterControlsProps {
  onSearch: (term: string) => void;
  onStateFilter: (state: string) => void;
  onSortChange: (sort: string) => void;
}

export function FilterControls({
  onSearch,
  onStateFilter,
  onSortChange,
}: FilterControlsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("data_desc");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch unique states from database
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("coverage_areas")
          .select("estado")
          .not("estado", "is", null);

        if (error) throw error;

        // Get unique states
        const uniqueStates = Array.from(
          new Set((data as any[]).map(item => item.estado))
        ).filter(state => state) as string[];

        // Sort alphabetically
        uniqueStates.sort();
        
        setAvailableStates(uniqueStates);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setStateFilter(newState);
    onStateFilter(newState);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    onSortChange(newSort);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStateFilter("all");
    setSortBy("data_desc");
    
    onSearch("");
    onStateFilter("all");
    onSortChange("data_desc");
  };

  return (
    <Card className="backdrop-blur-lg bg-white/60 border-0 shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="CEP, Rua, Bairro ou Cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </form>
            <p className="text-xs text-gray-500">
              Busque por qualquer parte do endereço
            </p>
          </div>

          {/* State filter */}
          <div className="space-y-2">
            <Label htmlFor="state-filter">Estado</Label>
            <select
              id="state-filter"
              value={stateFilter}
              onChange={handleStateChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Todos os estados</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Filtre endereços por estado
            </p>
          </div>

          {/* Sort control */}
          <div className="space-y-2">
            <Label htmlFor="sort-by">Ordenar por</Label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="data_desc">Data (mais recente)</option>
              <option value="data_asc">Data (mais antiga)</option>
              <option value="cep">CEP</option>
              <option value="cidade">Cidade</option>
            </select>
            <p className="text-xs text-gray-500">
              Escolha como ordenar os resultados
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-sm border-gray-300"
          >
            Limpar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
