
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Tag } from 'lucide-react';
import { Category, TransactionType } from '../types';
import { COLORS } from '../constants';

interface Props {
  categories: Category[];
  onAdd: (c: Omit<Category, 'id'>) => void;
  onDelete: (id: string) => void;
}

const CategoryManager: React.FC<Props> = ({ categories, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, type, color });
    setName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="text-indigo-600" />
          Nova Categoria
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Assinaturas, Cursos..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fluxo</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`py-3 rounded-xl border-2 transition-all font-bold ${type === 'INCOME' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`py-3 rounded-xl border-2 transition-all font-bold ${type === 'EXPENSE' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  Despesa
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cor da Etiqueta</label>
              <div className="grid grid-cols-5 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-10 rounded-lg transition-transform ${color === c ? 'scale-110 ring-2 ring-slate-300 ring-offset-2' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Adicionar Categoria
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Tag className="text-indigo-600" />
          Categorias Ativas
        </h3>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                <div>
                  <p className="font-bold text-slate-800">{cat.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cat.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onDelete(cat.id)}
                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
