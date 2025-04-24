import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoverageDataTable } from "./CoverageDataTable";
import { FilterControls } from "./FilterControls";
import { AddCoverageDialog } from "./AddCoverageDialog";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { CoverageAreasUploader } from "../CoverageAreasUploader";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { WebhookSettingsCard } from "../webhook/WebhookSettingsCard";

export function ViabilityManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("data_desc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAdmin, isLoading } = useIsAdmin();

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddNew = () => {
    setShowAddDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2b24a3] border-r-transparent"></div>
          <p className="text-[#2b24a3] font-medium">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl border shadow-lg max-w-xl mx-auto my-12">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <Search className="h-8 w-8 text-[#db451c]" />
          </div>
          <h2 className="text-2xl font-bold text-[#db451c] mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 max-w-md">
            Você não tem permissão para acessar esta seção do painel administrativo.
            Apenas usuários com perfil de administrador podem gerenciar as áreas de cobertura.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#efeef6] via-white to-[#e6eafe]">
      <div className="w-full max-w-6xl px-4 md:px-8 py-8 rounded-2xl glassmorphism-card shadow-xl border relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Seção Importar CSV */}
          <section className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-[#2b24a3] mb-2 drop-shadow">Importar CSV</h2>
            <Card className="backdrop-blur-lg bg-white/70 border-0 shadow-lg mb-3">
              <CardContent className="p-6">
                <CoverageAreasUploader />
              </CardContent>
            </Card>
            <Separator className="my-6" />
          </section>

          {/* Seção Endereços Salvos e Filtros */}
          <section className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-[#2b24a3] mb-2 drop-shadow">Endereços Salvos</h2>
            <Card className="backdrop-blur-lg bg-white/70 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle>
                  <span className="text-[#2b24a3] text-lg">Gerenciar Viabilidades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterControls
                  onSearch={setSearchTerm}
                  onStateFilter={setStateFilter}
                  onSortChange={setSortBy}
                />
                <div className="mt-6">
                  <CoverageDataTable
                    searchTerm={searchTerm}
                    stateFilter={stateFilter}
                    sortBy={sortBy}
                    onAddNew={handleAddNew}
                    onRefreshData={handleRefresh}
                  />
                </div>
              </CardContent>
            </Card>
            <Separator className="my-6" />
          </section>

          {/* NOVA SEÇÃO CONFIGURAÇÕES DE WEBHOOK */}
          <section className="col-span-1 md:col-span-2">
            <WebhookSettingsCard />
            <Separator className="my-6" />
          </section>

        </div>
        {/* Add Coverage Dialog */}
        <AddCoverageDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSave={() => {
            setShowAddDialog(false);
            handleRefresh();
          }}
        />
      </div>
    </div>
  );
}
