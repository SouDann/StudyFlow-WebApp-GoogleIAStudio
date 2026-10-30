import { Goal, GoalFormData } from '../types/goal';
import { getDateOffsetString } from '../utils/dateUtils';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_KEY = 'studyflow_initialized';

// Exemplos didáticos e acolhedores para estudantes iniciantes
export const SAMPLE_GOALS: GoalFormData[] = [
  {
    title: 'Aprender conceitos básicos de Lógica e Algoritmos',
    description: 'Assistir às 3 primeiras aulas do curso introdutório e resolver a lista com 5 exercícios práticos.',
    deadline: getDateOffsetString(3),
    status: 'em_andamento',
  },
  {
    title: 'Montar meu cronograma semanal de estudos',
    description: 'Reservar 45 minutos por dia, de segunda a sexta, com foco e pausas de 5 minutos.',
    deadline: getDateOffsetString(1),
    status: 'concluido',
  },
  {
    title: 'Criar resumo sobre Estruturas de Dados simples',
    description: 'Fazer mapa mental sobre listas, filas e pilhas para fixar o vocabulário.',
    deadline: getDateOffsetString(7),
    status: 'nao_iniciado',
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos armazenados no localStorage
   */
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Se nunca foi inicializado, fornece os exemplos para o estudante não começar do zero absoluto
        const wasInitialized = localStorage.getItem(INITIALIZED_KEY);
        if (!wasInitialized) {
          const initialGoals = this.seedSampleGoals();
          return initialGoals;
        }
        return [];
      }
      return JSON.parse(data) as Goal[];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa no localStorage
   */
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Adiciona um novo objetivo
   */
  addGoal(goalData: GoalFormData): Goal {
    const goals = this.getGoals();
    const now = new Date().toISOString();
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newGoal, ...goals];
    this.saveGoals(updated);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente
   */
  updateGoal(id: string, updates: Partial<GoalFormData>): Goal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const updatedGoal: Goal = {
      ...goals[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Alterna rapidamente o status do objetivo
   */
  toggleStatus(id: string): Goal | null {
    const goals = this.getGoals();
    const goal = goals.find((g) => g.id === id);
    if (!goal) return null;

    let nextStatus: Goal['status'] = 'em_andamento';
    if (goal.status === 'nao_iniciado') {
      nextStatus = 'em_andamento';
    } else if (goal.status === 'em_andamento') {
      nextStatus = 'concluido';
    } else {
      nextStatus = 'nao_iniciado';
    }

    return this.updateGoal(id, { status: nextStatus });
  },

  /**
   * Exclui um objetivo
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    this.saveGoals(filtered);
    return filtered.length < goals.length;
  },

  /**
   * Inicializa com exemplos didáticos para iniciantes
   */
  seedSampleGoals(): Goal[] {
    const now = new Date().toISOString();
    const goals: Goal[] = SAMPLE_GOALS.map((sample, idx) => ({
      ...sample,
      id: `goal_sample_${idx + 1}_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }));
    this.saveGoals(goals);
    return goals;
  },

  /**
   * Limpa todos os dados (para fins de teste ou recomeço limpo)
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(INITIALIZED_KEY, 'true');
  },
};
