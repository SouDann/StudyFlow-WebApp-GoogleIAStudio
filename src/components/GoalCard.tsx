import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';
import { Goal, GoalStatus, STATUS_CONFIG } from '../types/goal';
import { getDeadlineInfo } from '../utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = goal.status === 'concluido';
  const statusInfo = STATUS_CONFIG[goal.status];
  const deadlineInfo = getDeadlineInfo(goal.deadline, isCompleted);

  return (
    <article
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
        isCompleted
          ? 'border-slate-200/70 bg-slate-50/50'
          : deadlineInfo.isOverdue
          ? 'border-rose-200 ring-1 ring-rose-100'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      <div>
        {/* Topo do Cartão: Status e Ações */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Seletor rápido de Status */}
          <div className="relative inline-block">
            <select
              value={goal.status}
              onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-colors appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.borderColor}`}
              title="Clique para alterar status rapidamente"
            >
              <option value="nao_iniciado">⚪ Não iniciado</option>
              <option value="em_andamento">🔵 Em andamento</option>
              <option value="concluido">🟢 Concluído</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
              ▼
            </span>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold text-slate-900 leading-snug mb-2 ${
            isCompleted ? 'line-through text-slate-400' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição */}
        {goal.description ? (
          <p
            className={`text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-4 ${
              isCompleted ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">
            Sem descrição adicional
          </p>
        )}
      </div>

      {/* Rodapé do Cartão: Prazo e Botão de Conclusão Rápida */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        {/* Informação do Prazo */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${deadlineInfo.badgeClass}`}
          >
            {deadlineInfo.isOverdue && <AlertCircle className="w-3 h-3 text-rose-600 inline" />}
            {deadlineInfo.label}
          </span>
        </div>

        {/* Ação de alternar Conclusão */}
        <button
          onClick={() =>
            onStatusChange(
              goal.id,
              goal.status === 'concluido' ? 'em_andamento' : 'concluido'
            )
          }
          className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
            isCompleted
              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title={isCompleted ? 'Reabrir objetivo' : 'Marcar como concluído'}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Feito' : 'Concluir'}</span>
        </button>
      </div>
    </article>
  );
};
