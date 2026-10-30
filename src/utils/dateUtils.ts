/**
 * Utilitários para formatação e manipulação de datas no StudyFlow
 */

export function formatDatePtBR(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  
  // Trata YYYY-MM-DD sem distorção de timezone
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export interface DeadlineInfo {
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
  badgeClass: string;
}

export function getDeadlineInfo(dateString: string, isCompleted: boolean): DeadlineInfo {
  if (!dateString) {
    return {
      label: 'Sem prazo',
      isOverdue: false,
      isUrgent: false,
      badgeClass: 'text-slate-500 bg-slate-100',
    };
  }

  if (isCompleted) {
    return {
      label: formatDatePtBR(dateString),
      isOverdue: false,
      isUrgent: false,
      badgeClass: 'text-slate-600 bg-slate-100',
    };
  }

  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return {
      label: formatDatePtBR(dateString),
      isOverdue: false,
      isUrgent: false,
      badgeClass: 'text-slate-600 bg-slate-100',
    };
  }

  const deadline = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysLate = Math.abs(diffDays);
    return {
      label: `Atrasado (${daysLate} ${daysLate === 1 ? 'dia' : 'dias'})`,
      isOverdue: true,
      isUrgent: true,
      badgeClass: 'text-rose-700 bg-rose-50 border border-rose-200',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Vence hoje!',
      isOverdue: false,
      isUrgent: true,
      badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200 font-medium',
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Vence amanhã',
      isOverdue: false,
      isUrgent: true,
      badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200',
    };
  }

  if (diffDays <= 3) {
    return {
      label: `Vence em ${diffDays} dias`,
      isOverdue: false,
      isUrgent: true,
      badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200',
    };
  }

  return {
    label: formatDatePtBR(dateString),
    isOverdue: false,
    isUrgent: false,
    badgeClass: 'text-slate-600 bg-slate-100',
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
