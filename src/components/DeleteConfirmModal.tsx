import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Goal } from '../types/goal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900">
              Confirmar exclusão
            </h3>
            <p id="delete-dialog-desc" className="text-xs sm:text-sm text-slate-500 mt-1">
              Tem certeza de que deseja excluir o objetivo abaixo? Esta ação não pode ser desfeita.
            </p>

            {/* Caixa com o objetivo a ser deletado */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                "{goal.title}"
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-all cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
