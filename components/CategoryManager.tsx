
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Tag, Pipette } from 'lucide-react';
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
    // Mantém a última cor ou volta para a padrão
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cor da Identificação</label>
                <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono text-slate-600 uppercase">{color}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-2 mb-4">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-9 rounded-lg transition-all ${color === c ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-md' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
                {/* Seletor Customizado */}
                <div className="relative group h-9">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 transition-colors">
                    <Pipette size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Salvar Categoria
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Tag className="text-indigo-600" />
          Categorias Ativas
        </h3>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '500px' }}>
          {categories.length > 0 ? categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl shadow-sm border-2 border-white flex items-center justify-center text-white" 
                  style={{ backgroundColor: cat.color }}
                >
                  <Tag size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{cat.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${cat.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
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
          )) : (
            <div className="text-center py-10 text-slate-400 italic">
              Nenhuma categoria cadastrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
