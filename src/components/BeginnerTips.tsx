import React, { useState } from 'react';
import { Lightbulb, ChevronRight, X } from 'lucide-react';

const TIPS = [
  'Dica de Estudo: Metas menores são mais fáceis de concluir. Divida um assunto difícil em 3 pequenas tarefas.',
  'Dica de Estudo: Estudar 30 minutos todos os dias gera mais retenção do que 5 horas apenas no final de semana.',
  'Dica de Estudo: Ao marcar um objetivo como concluído, reserve 5 minutos para explicar o conteúdo com suas próprias palavras.',
  'Dica de Estudo: Se um prazo estiver apertado, ajuste-o com gentileza: constância vale mais do que pressa.',
];

export const BeginnerTips: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/70 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2.5 flex-1">
        <div className="p-1.5 rounded-lg bg-amber-100/90 text-amber-700 shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <p className="leading-snug">
          {TIPS[currentTipIndex]}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleNextTip}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded-lg hover:bg-amber-100/80 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
          title="Ver próxima dica"
        >
          <span>Outra dica</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-100/80 transition-colors cursor-pointer"
          title="Ocultar dica"
          aria-label="Ocultar dica"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
