
import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
import { Category, TransactionType, ExpenseNature } from '../types';

interface Props {
  categories: Category[];
  onClose: () => void;
  onSubmit: (t: any) => Promise<void>;
}

const TransactionForm: React.FC<Props> = ({ categories, onClose, onSubmit }) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [nature, setNature] = useState<ExpenseNature>('VARIABLE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtra categorias baseadas no tipo selecionado (Receita ou Despesa)
  const filteredCategories = categories.filter(c => c.type === type);

  // Importante: Reseta a categoria selecionada quando o tipo muda
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica com feedback no console para debug
    if (!description) { console.warn('Descrição ausente'); return; }
    if (!amount || parseFloat(amount) <= 0) { console.warn('Valor inválido'); return; }
    if (!categoryId) { console.warn('Categoria não selecionada'); alert('Por favor, selecione uma categoria.'); return; }

    setIsSubmitting(true);
    try {
      await onSubmit({
        description,
        amount: parseFloat(amount),
        date,
        type,
        categoryId,
        nature: type === 'EXPENSE' ? nature : null // Envia null explicitamente para receitas
      });
    } catch (error) {
      console.error('Falha ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Novo Lançamento</h3>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seletor de Tipo */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('INCOME')}
              disabled={isSubmitting}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg transition-all ${
                type === 'INCOME' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowUpCircle size={18} />
              <span className="font-semibold text-sm">Receita</span>
            </button>
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              disabled={isSubmitting}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg transition-all ${
                type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowDownCircle size={18} />
              <span className="font-semibold text-sm">Despesa</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Descrição</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                placeholder="Ex: Salário, Supermercado..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="0,00"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Data</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Categoria</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all disabled:opacity-50"
                  required
                >
                  <option value="">Selecionar...</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              {type === 'EXPENSE' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Natureza</label>
                  <select 
                    value={nature}
                    onChange={(e) => setNature(e.target.value as ExpenseNature)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                  >
                    <option value="VARIABLE">Variável</option>
                    <option value="FIXED">Fixa</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center space-x-2 active:scale-[0.98] transition-all disabled:opacity-70 ${
              type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <span>Confirmar Lançamento</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
