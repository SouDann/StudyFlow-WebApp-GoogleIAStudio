/**
 * Tipos de dados para o StudyFlow
 */

export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;

export interface GoalStatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  indicatorBg: string;
}

export const STATUS_CONFIG: Record<GoalStatus, GoalStatusConfig> = {
  nao_iniciado: {
    label: 'Não iniciado',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-200',
    indicatorBg: 'bg-amber-500',
  },
  em_andamento: {
    label: 'Em andamento',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-200',
    indicatorBg: 'bg-blue-600',
  },
  concluido: {
    label: 'Concluído',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    indicatorBg: 'bg-emerald-600',
  },
};

export type FilterOption = 'todos' | GoalStatus;
export type SortOption = 'prazo_asc' | 'prazo_desc' | 'recentes' | 'alfabetica';
