
import React, { useState } from 'react';
import { Wallet, Lock, User, Loader2, UserPlus, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: () => void;
}

type AuthMode = 'login' | 'register';

const Login: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const { error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (sbError) {
          setError('Email ou senha inválidos. Verifique suas credenciais.');
        } else {
          onLogin();
        }
      } else {
        const { error: regError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (regError) {
          setError('Erro ao criar conta: ' + regError.message);
        } else {
          setSuccess('Conta criada! Verifique seu email para confirmar o cadastro (se habilitado) ou tente logar.');
          setMode('login');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado de conexão.');
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
            <Wallet size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">FinançasPro</h1>
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? 'Gerenciamento seguro com Supabase Auth' : 'Crie sua conta segura agora'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
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
              mode === 'login' ? 'Entrar' : 'Cadastrar'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          {mode === 'login' ? (
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className="text-indigo-600 font-semibold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              <UserPlus size={16} />
              Não tem conta? Cadastre-se
            </button>
          ) : (
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
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
