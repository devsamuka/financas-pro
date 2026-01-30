
import React, { useMemo } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Scale, 
  Wallet,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Transaction, Category, FinancialGoal, FinancialSummary } from '../types';
import { formatCurrency, calculateProgress, getDaysRemaining } from '../utils';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  goals: FinancialGoal[];
}

const Dashboard: React.FC<Props> = ({ transactions, categories, goals }) => {
  const summary = useMemo<FinancialSummary>(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'INCOME') {
        acc.totalIncome += t.amount;
        acc.balance += t.amount;
      } else {
        acc.totalExpenses += t.amount;
        acc.balance -= t.amount;
        if (t.nature === 'FIXED') acc.fixedExpenses += t.amount;
        else acc.variableExpenses += t.amount;
      }
      return acc;
    }, {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      fixedExpenses: 0,
      variableExpenses: 0
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const expensesByCategory: Record<string, { amount: number, color: string }> = {};
    
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        const name = cat ? cat.name : 'Outros';
        const color = cat ? cat.color : '#cbd5e1'; // Fallback se não encontrar categoria
        
        if (!expensesByCategory[name]) {
          expensesByCategory[name] = { amount: 0, color: color };
        }
        expensesByCategory[name].amount += t.amount;
      });
    
    return Object.entries(expensesByCategory).map(([name, data]) => ({ 
      name, 
      value: data.amount,
      color: data.color 
    }));
  }, [transactions, categories]);

  const barData = useMemo(() => {
    return [
      { name: 'Entradas', valor: summary.totalIncome, color: '#10b981' },
      { name: 'Saídas', valor: summary.totalExpenses, color: '#ef4444' }
    ];
  }, [summary]);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          title="Saldo Atual" 
          value={formatCurrency(summary.balance)} 
          icon={<Wallet className="text-indigo-600" />} 
          color="bg-indigo-50"
          accent="border-indigo-100"
        />
        <Card 
          title="Receitas" 
          value={formatCurrency(summary.totalIncome)} 
          icon={<ArrowUpCircle className="text-emerald-600" />} 
          color="bg-emerald-50"
          accent="border-emerald-100"
        />
        <Card 
          title="Despesas" 
          value={formatCurrency(summary.totalExpenses)} 
          icon={<ArrowDownCircle className="text-rose-600" />} 
          color="bg-rose-50"
          accent="border-rose-100"
        />
        <Card 
          title="Economia" 
          value={`${summary.totalIncome > 0 ? Math.max(0, Math.round((summary.balance / summary.totalIncome) * 100)) : 0}%`} 
          icon={<Scale className="text-amber-600" />} 
          color="bg-amber-50"
          accent="border-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" />
              Comparativo Financeiro
            </h3>
            <div className="h-[300px] w-full relative overflow-hidden min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    formatter={(value: number) => [formatCurrency(value), 'Valor']}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={60}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-600" />
              Tipos de Gastos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fixos</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(summary.fixedExpenses)}</p>
                <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{width: `${summary.totalExpenses > 0 ? (summary.fixedExpenses / summary.totalExpenses) * 100 : 0}%`}} />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Variáveis</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(summary.variableExpenses)}</p>
                <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{width: `${summary.totalExpenses > 0 ? (summary.variableExpenses / summary.totalExpenses) * 100 : 0}%`}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza e Metas */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Despesas p/ Categoria</h3>
            <div className="h-[260px] w-full relative overflow-hidden min-h-[260px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Gasto']}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                  Sem despesas lançadas
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target size={20} />
              Minhas Metas
            </h3>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 2).map(goal => {
                  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="truncate pr-2">{goal.name}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-indigo-400/40 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-1000" style={{width: `${progress}%`}} />
                      </div>
                      <p className="text-[10px] text-indigo-100">Faltam {getDaysRemaining(goal.deadline)} dias</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-indigo-100 italic">Defina metas para acompanhar seu progresso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  accent: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color, accent }) => (
  <div className={`p-5 rounded-2xl border ${accent} ${color} shadow-sm transition-all hover:translate-y-[-2px]`}>
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
        {icon}
      </div>
    </div>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

export default Dashboard;
