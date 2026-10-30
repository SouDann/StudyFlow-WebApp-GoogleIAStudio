import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { FilterBar } from './components/FilterBar';
import { GoalCard } from './components/GoalCard';
import { GoalModal } from './components/GoalModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { BeginnerTips } from './components/BeginnerTips';
import { Goal, GoalFormData, GoalStatus, FilterOption, SortOption } from './types/goal';
import { storageService } from './services/storageService';
import { Plus, RotateCcw } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Estado para confirmação de exclusão
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filtros e busca
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('prazo_asc');

  // Carrega os objetivos do localStorage na montagem
  useEffect(() => {
    const loaded = storageService.getGoals();
    setGoals(loaded);
  }, []);

  // Handlers para Novo / Edição
  const handleOpenNewModal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleSaveGoal = (formData: GoalFormData) => {
    if (editingGoal) {
      // Atualizar objetivo existente
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) =>
          prev.map((g) => (g.id === editingGoal.id ? updated : g))
        );
      }
    } else {
      // Criar novo objetivo
      const newGoal = storageService.addGoal(formData);
      setGoals((prev) => [newGoal, ...prev]);
    }
  };

  // Handlers para Alteração Rápida de Status
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    }
  };

  // Handlers para Exclusão com Confirmação
  const handleRequestDelete = (goal: Goal) => {
    setDeletingGoal(goal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingGoal) {
      storageService.deleteGoal(deletingGoal.id);
      setGoals((prev) => prev.filter((g) => g.id !== deletingGoal.id));
      setIsDeleteModalOpen(false);
      setDeletingGoal(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingGoal(null);
  };

  // Carregar exemplos prontos para inspiração
  const handleLoadSamples = () => {
    const samples = storageService.seedSampleGoals();
    setGoals(samples);
  };

  // Filtragem, busca e ordenação dos objetivos
  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (currentFilter !== 'todos') {
      result = result.filter((g) => g.status === currentFilter);
    }

    // Busca textual (título ou descrição)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'prazo_asc') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'prazo_desc') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return b.deadline.localeCompare(a.deadline);
      }
      if (sortBy === 'recentes') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'alfabetica') {
        return a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' });
      }
      return 0;
    });

    return result;
  }, [goals, currentFilter, searchQuery, sortBy]);

  const hasAnyGoals = goals.length > 0;
  const isFilterActive = currentFilter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Cabeçalho */}
      <Header onOpenNewModal={handleOpenNewModal} totalGoals={goals.length} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Dica motivacional para iniciantes */}
        <BeginnerTips />

        {/* Resumo estatístico e contadores de metas */}
        <StatsSummary goals={goals} />

        {/* Barra de Busca, Filtros e Ordenação (exibida se houver metas) */}
        {hasAnyGoals && (
          <FilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            goals={goals}
          />
        )}

        {/* Listagem de Objetivos em Cartões ou Estado Vazio */}
        {filteredAndSortedGoals.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {currentFilter === 'todos'
                  ? 'Todos os Objetivos'
                  : currentFilter === 'nao_iniciado'
                  ? 'Objetivos Não Iniciados'
                  : currentFilter === 'em_andamento'
                  ? 'Objetivos em Andamento'
                  : 'Objetivos Concluídos'}
                <span className="ml-2 text-xs font-normal text-slate-400 lowercase">
                  ({filteredAndSortedGoals.length} {filteredAndSortedGoals.length === 1 ? 'item' : 'itens'})
                </span>
              </h2>

              <button
                onClick={handleOpenNewModal}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar outro</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleRequestDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            isFiltered={hasAnyGoals && isFilterActive}
            onOpenNewModal={handleOpenNewModal}
            onClearFilter={() => {
              setCurrentFilter('todos');
              setSearchQuery('');
            }}
            onLoadSamples={handleLoadSamples}
          />
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong className="text-slate-600 font-semibold">StudyFlow</strong> — Seu companheiro simples para organizar metas de aprendizagem.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Dados salvos automaticamente no seu navegador (localStorage)</span>
            {hasAnyGoals && (
              <button
                onClick={handleLoadSamples}
                className="hover:text-indigo-600 inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Recarregar exemplos de objetivos"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar exemplos</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modal de Adicionar / Editar Objetivo */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        goal={deletingGoal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
