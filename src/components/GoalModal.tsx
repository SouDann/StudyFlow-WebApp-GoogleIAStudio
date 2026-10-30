import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus } from '../types/goal';
import { getTodayDateString, getDateOffsetString } from '../utils/dateUtils';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GoalFormData) => void;
  initialGoal?: Goal | null; // Se fornecido, é edição; se null, é novo
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [touched, setTouched] = useState(false);

  // Preenche dados ao abrir ou alterar meta inicial
  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description || '');
      setDeadline(initialGoal.deadline || '');
      setStatus(initialGoal.status);
    } else {
      // Padrões para novo objetivo
      setTitle('');
      setDescription('');
      setDeadline(getDateOffsetString(7)); // Padrão: 1 semana a frente
      setStatus('nao_iniciado');
    }
    setTouched(false);
  }, [initialGoal, isOpen]);

  if (!isOpen) return null;

  const isTitleValid = title.trim().length > 0;
  const showError = touched && !isTitleValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isTitleValid) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || '',
      status,
    });

    onClose();
  };

  const handleQuickDate = (offsetDays: number) => {
    setDeadline(getDateOffsetString(offsetDays));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="goal-modal-title" className="text-lg font-bold text-slate-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize os dados e acompanhe o seu ritmo'
                  : 'Dê o primeiro passo definindo o que você quer aprender'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com Scroll se necessário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              O que você quer aprender? <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Ex: Aprender laços de repetição (for e while)"
              maxLength={120}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all ${
                showError
                  ? 'border-rose-300 bg-rose-50/30 focus:ring-2 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            {showError ? (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Por favor, informe o título do seu objetivo.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Dica: Escolha uma meta pequena e direta para facilitar a conquista.</span>
                <span>{title.length}/120</span>
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detalhes ou plano de ação <span className="text-slate-400 font-normal text-xs lowercase">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Ler o capítulo 3 da apostila, fazer 4 exercícios práticos e tirar dúvidas com o grupo."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Campo: Prazo com atalhos inteligentes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-deadline" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prazo para conclusão
              </label>
              <span className="text-[11px] text-slate-400">Atalhos rápidos:</span>
            </div>

            <div className="relative mb-2">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              />
            </div>

            {/* Botões de atalho de data */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(3)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                Em 3 dias
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(7)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                Em 1 semana
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(30)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                Em 1 mês
              </button>
            </div>
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Status inicial
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'nao_iniciado', label: 'Não iniciado', icon: '⚪' },
                { id: 'em_andamento', label: 'Em andamento', icon: '🔵' },
                { id: 'concluido', label: 'Concluído', icon: '🟢' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setStatus(opt.id as GoalStatus)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    status === opt.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
