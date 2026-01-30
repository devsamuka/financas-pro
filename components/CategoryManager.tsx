
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Tag, Palette, Hash } from 'lucide-react';
import { Category, TransactionType } from '../types';

interface Props {
  categories: Category[];
  onAdd: (c: Omit<Category, 'id'>) => void;
  onDelete: (id: string) => void;
}

const CategoryManager: React.FC<Props> = ({ categories, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [color, setColor] = useState('#6366f1'); // Default: Indigo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !color) return;
    onAdd({ name, type, color });
    setName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulário de Criação */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Palette className="text-indigo-600" size={24} />
          Personalizar Categoria
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome da Categoria</label>
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fluxo Financeiro</label>
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Seletor de Espectro (Cor)</label>
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all">
                <div className="relative w-14 h-14 shrink-0">
                  <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="w-full h-full rounded-xl shadow-inner border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white"
                    style={{ backgroundColor: color }}
                  >
                    <Palette size={20} className="drop-shadow-sm" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1 text-slate-600 font-mono font-bold">
                    <Hash size={14} className="text-slate-400" />
                    <span className="uppercase">{color.replace('#', '')}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Clique no quadrado para escolher qualquer cor no espectro.</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar Categoria
          </button>
        </form>
      </div>

      {/* Lista Visual */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="text-indigo-600" />
            Minhas Categorias
          </h3>
          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
            {categories.length} Itens
          </span>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '530px' }}>
          {categories.length > 0 ? categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-slate-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm" 
                  style={{ backgroundColor: cat.color }}
                >
                  <Tag size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 leading-tight">{cat.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${cat.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {cat.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{cat.color}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onDelete(cat.id)}
                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Tag size={32} />
              </div>
              <p className="text-slate-400 text-sm font-medium">Nenhuma categoria configurada ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
