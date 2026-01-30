
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Settings, 
  Plus, 
  TrendingUp, 
  Wallet,
  Menu,
  X,
  Loader2,
  Users,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { Transaction, Category, FinancialGoal, TransactionType, ExpenseNature } from './types';
import { INITIAL_CATEGORIES } from './constants';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import GoalManager from './components/GoalManager';
import CategoryManager from './components/CategoryManager';
import TransactionForm from './components/TransactionForm';
import UserManagement from './components/UserManagement';
import Login from './components/Login';

type View = 'dashboard' | 'transactions' | 'goals' | 'categories' | 'users';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Listener oficial do Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveView('dashboard');
  };

  const mapTransaction = (t: any): Transaction => ({
    id: t.id,
    description: t.description || 'Sem descrição',
    amount: Number(t.amount) || 0,
    date: t.date || new Date().toISOString(),
    type: t.type as TransactionType,
    categoryId: t.category_id,
    nature: t.nature as ExpenseNature
  });

  const mapGoal = (g: any): FinancialGoal => ({
    id: g.id,
    name: g.name || 'Meta sem nome',
    targetAmount: Number(g.target_amount) || 0,
    currentAmount: Number(g.current_amount) || 0,
    deadline: g.deadline || new Date().toISOString()
  });

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setInitError(null);
      try {
        // Agora o RLS garante que só pegamos os dados do usuário atual
        const [transRes, catsRes, goalsRes] = await Promise.all([
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('categories').select('*'),
          supabase.from('goals').select('*')
        ]);

        if (transRes.error) throw transRes.error;
        if (transRes.data) setTransactions(transRes.data.map(mapTransaction));
        
        if (catsRes.data && catsRes.data.length > 0) {
          setCategories(catsRes.data);
        } else {
          // Se não houver categorias, semeamos as iniciais vinculadas a este usuário
          const categoriesToInsert = INITIAL_CATEGORIES.map(cat => ({
            ...cat,
            user_id: session.user.id
          }));
          const { data: inserted } = await supabase.from('categories').insert(categoriesToInsert).select();
          if (inserted) setCategories(inserted);
        }

        if (goalsRes.data) setGoals(goalsRes.data.map(mapGoal));
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        setInitError(error.message || "Erro de conexão com o servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    try {
      const payload: any = {
        description: t.description,
        amount: t.amount,
        date: t.date,
        type: t.type,
        category_id: t.categoryId,
        user_id: session.user.id // Vincula explicitamente
      };

      if (t.type === 'EXPENSE' && t.nature) {
        payload.nature = t.nature;
      }

      const { data, error } = await supabase.from('transactions').insert([payload]).select();

      if (error) throw error;

      if (data && data[0]) {
        setTransactions(prev => [mapTransaction(data[0]), ...prev]);
        setShowTransactionForm(false);
      }
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = async (c: Omit<Category, 'id'>) => {
    const { data, error } = await supabase.from('categories').insert([{ ...c, user_id: session.user.id }]).select();
    if (data) setCategories(prev => [...prev, data[0]]);
    if (error) alert(error.message);
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addGoal = async (g: Omit<FinancialGoal, 'id'>) => {
    const payload = {
      name: g.name,
      target_amount: g.targetAmount,
      current_amount: g.currentAmount,
      deadline: g.deadline,
      user_id: session.user.id
    };
    const { data } = await supabase.from('goals').insert([payload]).select();
    if (data) setGoals(prev => [...prev, mapGoal(data[0])]);
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const newAmount = goal.currentAmount + amount;
    const { error } = await supabase.from('goals').update({ current_amount: newAmount }).eq('id', id);
    if (!error) setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g));
  };

  const NavigationItem = ({ view, label, icon: Icon }: { view: View, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveView(view); setIsMobileMenuOpen(false); }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all ${
        activeView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (!session) return <Login onLogin={() => {}} />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-600 font-medium">Autenticando e carregando dados...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-rose-100">
          <AlertCircle className="mx-auto text-rose-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Erro de Segurança</h2>
          <p className="text-slate-600 mb-6">{initError}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Tentar Novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 fixed h-full shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 mb-8">
          <Wallet size={32} />
          <h1 className="text-xl font-bold tracking-tight">FinançasPro</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <NavigationItem view="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavigationItem view="transactions" label="Transações" icon={TrendingUp} />
          <NavigationItem view="goals" label="Metas" icon={Target} />
          <NavigationItem view="categories" label="Categorias" icon={Settings} />
          <NavigationItem view="users" label="Meu Perfil" icon={Users} />
        </nav>
        <div className="pt-6 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 rounded-xl overflow-hidden">
            <div className="w-10 h-10 min-w-[40px] rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {session.user.email?.[0].toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400 font-medium">Logado como:</p>
              <p className="text-sm font-bold text-slate-800 truncate">{session.user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg font-medium transition-colors">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center space-x-2 text-indigo-600">
          <Wallet size={24} />
          <h1 className="text-lg font-bold">FinançasPro</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-30 pt-20 px-6 flex flex-col">
          <nav className="space-y-2">
            <NavigationItem view="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavigationItem view="transactions" label="Transações" icon={TrendingUp} />
            <NavigationItem view="goals" label="Metas" icon={Target} />
            <NavigationItem view="categories" label="Categorias" icon={Settings} />
            <NavigationItem view="users" label="Meu Perfil" icon={Users} />
          </nav>
          <button onClick={handleLogout} className="mt-auto mb-10 py-3 bg-rose-50 text-rose-500 rounded-xl font-bold flex items-center justify-center gap-2">
            <LogOut size={20} /> Sair
          </button>
        </div>
      )}

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'transactions' && 'Transações'}
                {activeView === 'goals' && 'Metas'}
                {activeView === 'categories' && 'Categorias'}
                {activeView === 'users' && 'Meu Perfil'}
              </h2>
            </div>
            {activeView !== 'users' && (
              <button onClick={() => setShowTransactionForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                <Plus size={20} />
                <span className="hidden sm:inline">Novo Lançamento</span>
              </button>
            )}
          </div>

          {activeView === 'dashboard' && <Dashboard transactions={transactions} categories={categories} goals={goals} />}
          {activeView === 'transactions' && <TransactionList transactions={transactions} categories={categories} onDelete={deleteTransaction} />}
          {activeView === 'goals' && <GoalManager goals={goals} onAdd={addGoal} onDelete={deleteGoal} onUpdateProgress={updateGoalProgress} />}
          {activeView === 'categories' && <CategoryManager categories={categories} onAdd={addCategory} onDelete={deleteCategory} />}
          {activeView === 'users' && <UserManagement user={session.user} />}
        </div>
      </main>

      {showTransactionForm && (
        <TransactionForm categories={categories} onClose={() => setShowTransactionForm(false)} onSubmit={addTransaction} />
      )}
    </div>
  );
};

export default App;
