
import { Category } from './types';

// Removendo IDs fixos para que o banco gere UUIDs válidos
export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Salário', type: 'INCOME', color: '#10b981' },
  { name: 'Freelance', type: 'INCOME', color: '#34d399' },
  { name: 'Investimentos', type: 'INCOME', color: '#059669' },
  { name: 'Aluguel', type: 'EXPENSE', color: '#ef4444' },
  { name: 'Alimentação', type: 'EXPENSE', color: '#f59e0b' },
  { name: 'Transporte', type: 'EXPENSE', color: '#3b82f6' },
  { name: 'Lazer', type: 'EXPENSE', color: '#8b5cf6' },
  { name: 'Saúde', type: 'EXPENSE', color: '#ec4899' },
];

export const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];
