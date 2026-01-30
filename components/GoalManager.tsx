
import React, { useState } from 'react';
import { Target, Plus, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { FinancialGoal } from '../types';
import { formatCurrency, calculateProgress, getDaysRemaining } from '../utils';

interface Props {
  goals: FinancialGoal[];
  onAdd: (g: Omit<FinancialGoal, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, amount: number) => void;
}

const GoalManager: React.FC<Props> = ({ goals, onAdd, onDelete, onUpdateProgress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [updateAmount, setUpdateAmount] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;
    onAdd({
      name,
      targetAmount: parseFloat(target),
      currentAmount: 0,
      deadline
    });
    setName('');
    setTarget('');
    setDeadline('');
    setShowAddForm(false);
  };

  const handleUpdate = (id: string) => {
    const amount = parseFloat(updateAmount[id] || '0');
    if (amount === 0) return;
    onUpdateProgress(id, amount);
    setUpdateAmount(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Goal Button */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="h-full min-h-[200px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <span className="mt-4 font-bold">Criar Nova Meta</span>
        </button>

        {goals.map(goal => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysLeft = getDaysRemaining(goal.deadline);
          
          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Target size={24} />
                  </div>
                  <button 
                    onClick={() => onDelete(goal.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{goal.name}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    Até {new Intl.DateTimeFormat('pt-BR').format(new Date(goal.deadline))} ({daysLeft} dias restantes)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-slate-600">
                      {formatCurrency(goal.currentAmount)} <span className="text-slate-400">/ {formatCurrency(goal.targetAmount)}</span>
                    </p>
                    <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                      style={{width: `${progress}%`}}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Adicionar valor..."
                    value={updateAmount[goal.id] || ''}
                    onChange={(e) => setUpdateAmount(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button 
                    onClick={() => handleUpdate(goal.id)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                  >
                    <TrendingUp size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="text-indigo-600" />
              Definir Nova Meta
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nome da Meta</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Viagem, Carro Novo, Reserva..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Valor Alvo (R$)</label>
                  <input 
                    type="number" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="20000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Data Limite</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalManager;
