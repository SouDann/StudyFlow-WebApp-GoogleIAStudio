import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { FilterOption, SortOption, Goal } from '../types/goal';

interface FilterBarProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  goals: Goal[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  goals,
}) => {
  const countAll = goals.length;
  const countNaoIniciado = goals.filter((g) => g.status === 'nao_iniciado').length;
  const countEmAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const countConcluido = goals.filter((g) => g.status === 'concluido').length;

  const filters: { id: FilterOption; label: string; count: number }[] = [
    { id: 'todos', label: 'Todos', count: countAll },
    { id: 'nao_iniciado', label: 'Não iniciados', count: countNaoIniciado },
    { id: 'em_andamento', label: 'Em andamento', count: countEmAndamento },
    { id: 'concluido', label: 'Concluídos', count: countConcluido },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4">
      {/* Linha de Busca e Ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 hover:bg-slate-200 px-1.5 py-0.5 rounded-full"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="prazo_asc">Prazo mais próximo</option>
            <option value="prazo_desc">Prazo mais distante</option>
            <option value="recentes">Mais recentes primeiro</option>
            <option value="alfabetica">Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Tabs de Filtro por Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline-flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filtro:
        </span>
        {filters.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
