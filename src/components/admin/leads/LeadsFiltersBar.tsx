
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface LeadsFiltersBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  originFilter: string;
  setOriginFilter: (value: string) => void;
  origins: string[];
}

export function LeadsFiltersBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  originFilter,
  setOriginFilter,
  origins,
}: LeadsFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Buscar leads..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 text-sm"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-40 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="viable">Viável</SelectItem>
            <SelectItem value="not_viable">Não Viável</SelectItem>
            <SelectItem value="waiting_docs">Aguardando Docs</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="rejected">Recusado</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={originFilter} 
          onValueChange={setOriginFilter}
        >
          <SelectTrigger className="w-full sm:w-40 text-sm">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {origins.map((origin) => (
              <SelectItem key={origin} value={origin}>
                {origin.charAt(0).toUpperCase() + origin.slice(1)}
              </SelectItem>
            ))}
            <SelectItem value="acesso-direto">Acesso Direto</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
