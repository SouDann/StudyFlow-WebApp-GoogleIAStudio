import React from 'react';
import { Target, CheckCircle2, Clock, CircleDot, TrendingUp } from 'lucide-react';
import { Goal } from '../types/goal';

interface StatsSummaryProps {
  goals: Goal[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ goals }) => {
  const total = goals.length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;

  const percentage = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Estatísticas de Objetivos" className="space-y-4">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cadastrados */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600">Total de objetivos</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {total}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {total === 1 ? '1 meta cadastrada' : `${total} metas cadastradas`}
            </p>
          </div>
        </div>

        {/* Em andamento */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600">Em andamento</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight">
              {emAndamento}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {emAndamento === 1 ? 'Em progresso ativo' : 'Em progresso ativo'}
            </p>
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600">Concluídos</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">
              {concluidos}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {percentage}% de taxa de conclusão
            </p>
          </div>
        </div>

        {/* Não iniciados */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600">Não iniciados</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CircleDot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-700 tracking-tight">
              {naoIniciados}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prontos para começar
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Progresso Acolhedora */}
      {total > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Progresso Geral de Estudos
              </span>
              <p className="text-xs text-slate-500">
                {concluidos} de {total} objetivos concluídos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-72">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 min-w-[36px] text-right">
              {percentage}%
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
