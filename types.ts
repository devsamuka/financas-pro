
export type TransactionType = 'INCOME' | 'EXPENSE';
export type ExpenseNature = 'FIXED' | 'VARIABLE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  nature?: ExpenseNature; // Only for expenses
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface AppUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  password?: string;
  created_at?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  fixedExpenses: number;
  variableExpenses: number;
}
