
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
};

export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress), 100);
};

export const getDaysRemaining = (deadline: string): number => {
  const diff = new Date(deadline).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
