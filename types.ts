
export type TransactionType = 'INCOME' | 'EXPENSE';
export type ExpenseNature = 'FIXED' | 'VARIABLE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  user_id?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  nature?: ExpenseNature;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  fixedExpenses: number;
  variableExpenses: number;
}
