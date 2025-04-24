
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CoverageAreaType } from "../../../types/coverage-area";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: CoverageAreaType | null;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  item,
}: DeleteConfirmDialogProps) {
  if (!item) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="backdrop-blur-lg bg-white/90 border-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#db451c]">
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir o endereço com CEP <strong>{item.cep}</strong>. 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#db451c] hover:bg-[#b93e19] text-white"
            onClick={onConfirm}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
