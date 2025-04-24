
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { CoverageAreaType } from "@/types/coverage-area";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { EditCoverageDialog } from "./EditCoverageDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";

interface CoverageDataTableProps {
  searchTerm: string;
  stateFilter: string;
  sortBy: string;
  onAddNew: () => void;
  onRefreshData: () => void;
}

export const CoverageDataTable = ({
  searchTerm,
  stateFilter,
  sortBy,
  onAddNew,
  onRefreshData,
}: CoverageDataTableProps) => {
  const [data, setData] = useState<CoverageAreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CoverageAreaType | null>(null);
  const [deleteItem, setDeleteItem] = useState<CoverageAreaType | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const fetchData = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('coverage_areas')
        .select('id, cep, rua, bairro, cidade, estado, created_at', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`cep.ilike.%${searchTerm}%,rua.ilike.%${searchTerm}%,bairro.ilike.%${searchTerm}%,cidade.ilike.%${searchTerm}%`);
      }

      if (stateFilter && stateFilter !== 'all') {
        query = query.eq('estado', stateFilter);
      }

      const [sortField, sortDirection] = sortBy.split('_');
      query = query.order(sortField === 'data' ? 'created_at' : sortField, { ascending: sortDirection === 'asc' });

      query = query.range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setTotalCount(0);
        return;
      }

      setData(Array.isArray(data) ? data : []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [searchTerm, stateFilter, sortBy, currentPage, pageSize, onRefreshData]);

  const handleEdit = (item: CoverageAreaType) => {
    setEditingItem(item);
  };

  const handleDelete = (item: CoverageAreaType) => {
    setDeleteItem(item);
  };

  const handleSaveEdit = async () => {
    setEditingItem(null);
    fetchData();
  };

  const handleConfirmDelete = async () => {
    setDeleteItem(null);
    fetchData();
  };

  const getTotalPages = () => Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < getTotalPages()) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Mostrando {data.length} de {totalCount} resultados
        </span>
        <Button
          variant="default"
          className="bg-[#db451c] hover:bg-[#b93e19] text-white font-medium transition-colors shadow-md px-5 py-2"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar CEP
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2b24a3] border-r-transparent"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 border rounded-2xl bg-white/50 backdrop-blur-md shadow-md">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-500">Nenhum resultado encontrado</h3>
          <p className="text-gray-400">Tente ajustar os filtros ou adicione novos CEPs</p>
        </div>
      ) : (
        <>
          <div className="border-0 rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl bg-white/70">
            <Table>
              <TableHeader className="bg-[#efeef6] backdrop-blur-md border-b-2 border-[#2b24a3]/10">
                <TableRow>
                  <TableHead>CEP</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="bg-white/50 hover:bg-[#e6eafe]/60 transition-all">
                    <TableCell className="font-bold text-[#2b24a3]">{item.cep}</TableCell>
                    <TableCell>{item.rua || 'N/A'}</TableCell>
                    <TableCell>{item.bairro || 'N/A'}</TableCell>
                    <TableCell>{item.cidade || 'N/A'}</TableCell>
                    <TableCell>
                      {item.estado ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{item.estado}</Badge>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 text-[#2b24a3] hover:bg-[#2b24a3]/10"
                        aria-label="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        className="h-8 w-8 text-[#db451c] hover:bg-[#db451c]/10"
                        aria-label="Deletar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="rounded-lg"
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página <span className="font-bold text-[#2b24a3]">{currentPage + 1}</span> de {getTotalPages()}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === getTotalPages() - 1 || getTotalPages() === 0}
              className="rounded-lg"
            >
              Próxima
            </Button>
          </div>
        </>
      )}

      {/* Edit dialog */}
      {editingItem && (
        <EditCoverageDialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
          item={editingItem}
        />
      )}

      {/* Delete confirmation dialog */}
      {deleteItem && (
        <DeleteConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
          item={deleteItem}
        />
      )}
    </div>
  );
};

// Este arquivo está ficando muito longo! Considere pedir para refatorar em arquivos menores depois desta alteração.
