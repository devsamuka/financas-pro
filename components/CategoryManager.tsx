
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Tag, Palette } from 'lucide-react';
import { Category, TransactionType } from '../types';

interface Props {
  categories: Category[];
  onAdd: (c: Omit<Category, 'id'>) => void;
  onDelete: (id: string) => void;
}

const CategoryManager: React.FC<Props> = ({ categories, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [color, setColor] = useState('#6366f1'); // Cor padrão (Indigo 500)

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
          <Palette className="text-indigo-600" />
          Configurar Categoria
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de Fluxo</label>
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cor de Identificação</label>
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 bg-transparent cursor-pointer rounded-lg overflow-hidden border-none"
                />
                <div className="flex-1">
                  <p className="text-sm font-mono text-slate-600 uppercase font-bold">{color}</p>
                  <p className="text-[10px] text-slate-400">Clique no ícone para abrir o seletor</p>
                </div>
                <div className="w-8 h-8 rounded-full shadow-inner border border-white" style={{ backgroundColor: color }} />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Criar Categoria
          </button>
        </form>
      </div>

      {/* Lista de Categorias Ativas */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="text-indigo-600" />
            Categorias
          </h3>
          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">{categories.length} Total</span>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2" style={{ maxHeight: '520px' }}>
          {categories.length > 0 ? categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-300 transition-all">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl shadow-sm border-2 border-white flex items-center justify-center text-white" 
                  style={{ backgroundColor: cat.color }}
                >
                  <Tag size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{cat.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${cat.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {cat.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">{cat.color}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onDelete(cat.id)}
                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Excluir Categoria"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-400 italic">
              Nenhuma categoria personalizada encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
