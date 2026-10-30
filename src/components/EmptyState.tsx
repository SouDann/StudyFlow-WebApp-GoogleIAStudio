import React from 'react';
import { BookOpen, SearchX, Plus, Sparkles, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewModal: () => void;
  onClearFilter?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewModal,
  onClearFilter,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center max-w-lg mx-auto my-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
          Não encontramos objetivos com os termos ou status selecionados. Tente ajustar a busca.
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            Limpar busca e filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center max-w-lg mx-auto my-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-100 to-sky-100 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
        <BookOpen className="w-8 h-8" />
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60 mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        Comece a sua jornada de estudos
      </span>
      <h3 className="text-xl font-bold text-slate-900">
        Você ainda não cadastrou nenhum objetivo
      </h3>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        Grandes conquistas começam com pequenos passos bem definidos. Cadastre o primeiro tópico, livro ou disciplina que você deseja aprender.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            title="Carregar objetivos de exemplo para você se inspirar"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Ver Exemplos Prontos</span>
          </button>
        )}
      </div>
    </div>
  );
};
