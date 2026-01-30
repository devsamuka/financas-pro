
import React, { useState } from 'react';
import { Wallet, Lock, User, Loader2, UserPlus, ArrowLeft, Terminal, Copy, Check, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AppUser } from '../types';

interface Props {
  onLogin: (user: AppUser) => void;
}

type AuthMode = 'login' | 'register';

const Login: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSqlSetup, setShowSqlSetup] = useState(false);
  const [copied, setCopied] = useState(false);

  // Script SQL melhorado para lidar com tabelas já existentes (Migração)
  const sqlScript = `-- 1. Criar ou Atualizar tabela de usuários
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- MIGRATION: Garante que a coluna 'email' existe se a tabela foi criada antes
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_users' AND column_name='email') THEN
        ALTER TABLE public.app_users ADD COLUMN email TEXT UNIQUE;
        -- Atualiza para NOT NULL após garantir que a coluna existe
        UPDATE public.app_users SET email = username || '@placeholder.com' WHERE email IS NULL;
        ALTER TABLE public.app_users ALTER COLUMN email SET NOT NULL;
    END IF;
END $$;

ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;

-- 2. Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    color TEXT NOT NULL
);
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- 3. Transações
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    nature TEXT CHECK (nature IN ('FIXED', 'VARIABLE'))
);
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- 4. Metas
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC DEFAULT 0,
    deadline DATE NOT NULL
);
ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setShowSqlSetup(false);

    try {
      if (mode === 'login') {
        const { data, error: sbError } = await supabase
          .from('app_users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (sbError) {
          if (sbError.message.includes('app_users') || sbError.code === 'PGRST104' || sbError.message.includes('column')) {
            setError('Estrutura do banco de dados inconsistente.');
            setShowSqlSetup(true);
          } else {
            setError('Usuário ou senha incorretos.');
          }
        } else if (!data) {
          setError('Usuário não encontrado.');
        } else {
          onLogin(data);
        }
      } else {
        const { data: existing, error: checkErr } = await supabase
          .from('app_users')
          .select('id')
          .or(`username.eq.${username},email.eq.${email}`)
          .maybeSingle();

        if (checkErr && (checkErr.code === 'PGRST104' || checkErr.message.includes('column'))) {
          setError('Erro de Schema: A coluna "email" não foi encontrada no banco.');
          setShowSqlSetup(true);
          return;
        }

        if (existing) {
          setError('Usuário ou e-mail já estão em uso.');
          setIsLoading(false);
          return;
        }

        const { data, error: regError } = await supabase
          .from('app_users')
          .insert([{ username, email, full_name: fullName, password }])
          .select()
          .single();

        if (regError) {
          setError('Erro ao realizar cadastro: ' + regError.message);
          if (regError.message.includes('app_users') || regError.message.includes('column')) {
             setShowSqlSetup(true);
          }
        } else {
          setSuccess('Cadastro realizado com sucesso! Você já pode entrar.');
          setMode('login');
          setFullName('');
          setEmail('');
          setUsername('');
          setPassword('');
        }
      }
    } catch (err) {
      setError('Erro crítico de conexão.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-2">
            {mode === 'login' ? <Wallet size={40} /> : <UserPlus size={40} />}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">FinançasPro</h1>
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? 'Entre para gerenciar suas finanças' : 'Crie sua conta para começar'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        {showSqlSetup && (
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Terminal size={16} />
                  <span>Atualização de Banco Necessária</span>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-100 transition-all"
                  title="Recarregar página após executar SQL"
                >
                  <RefreshCw size={16} />
                </button>
            </div>
            <p className="text-[11px] text-indigo-600 leading-relaxed">
              O Supabase ainda não reconheceu a nova coluna de <b>e-mail</b>. <br/>
              1. No painel do Supabase, vá em <b>SQL Editor</b>.<br/>
              2. Cole o código abaixo e clique em <b>Run</b>.<br/>
              3. <b>Importante:</b> Clique no botão de recarregar acima ou atualize o navegador após o sucesso no Supabase.
            </p>
            <div className="relative group">
              <pre className="text-[9px] bg-indigo-900 text-indigo-100 p-4 rounded-xl overflow-x-auto max-h-40 custom-scrollbar font-mono">
                {sqlScript}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-lg"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-3">
            {mode === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nome Completo"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário (Login)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center ${
              mode === 'login' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              mode === 'login' ? 'Acessar Sistema' : 'Criar Conta'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          {mode === 'login' ? (
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); setShowSqlSetup(false); }}
              className="text-indigo-600 font-semibold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              <UserPlus size={16} />
              Não tem conta? Cadastre-se
            </button>
          ) : (
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); setShowSqlSetup(false); }}
              className="text-slate-600 font-semibold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Já tem conta? Faça login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
