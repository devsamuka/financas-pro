
import React, { useState } from 'react';
import { Search, Filter, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, categories, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterType('INCOME')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'INCOME' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Entradas
          </button>
          <button 
            onClick={() => setFilterType('EXPENSE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Saídas
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Tipo/Natureza</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length > 0 ? filteredTransactions.map((t) => {
              const category = categories.find(c => c.id === t.categoryId);
              return (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 text-sm">{t.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{backgroundColor: `${category?.color}20`, color: category?.color}}>
                      {category?.name || 'Indefinido'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <div className={`flex items-center space-x-1 text-xs font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'INCOME' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        <span>{t.type === 'INCOME' ? 'RECEITA' : 'DESPESA'}</span>
                      </div>
                      {t.nature && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{t.nature === 'FIXED' ? 'Fixa' : 'Variável'}</span>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-slate-100 rounded-full text-slate-400">
                      <Filter size={48} />
                    </div>
                    <p className="text-slate-500 font-medium">Nenhuma transação encontrada.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
