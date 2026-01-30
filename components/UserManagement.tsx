
import React from 'react';
import { Shield, Mail, Calendar, User, AlertCircle } from 'lucide-react';

interface Props {
  user: any;
}

const UserManagement: React.FC<Props> = ({ user }) => {
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || 'Usuário';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <Shield size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white">
            {userName[0].toUpperCase()}
          </div>
          
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-2xl font-bold text-slate-800">{userName}</h3>
            <p className="text-slate-500 font-medium">Gerenciamento de perfil e segurança</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                 Autenticado via Supabase
               </span>
               <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                 Nível: Usuário
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <User size={18} className="text-indigo-600" />
            Dados Pessoais
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Nome Completo</p>
              <p className="text-slate-800 font-medium">{userName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">E-mail Principal</p>
              <p className="text-slate-800 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" />
            Atividade da Conta
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Criado em</p>
              <p className="text-slate-800 font-medium">
                {new Date(user.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Último Acesso</p>
              <p className="text-slate-800 font-medium">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR', { dateStyle: 'long' }) : 'Recentemente'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
        <AlertCircle className="text-amber-600 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-800">Segurança de Dados</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            Seus dados financeiros estão protegidos por <b>Row Level Security (RLS)</b>. Somente o titular desta conta (você) possui chaves criptográficas para visualizar ou modificar as transações vinculadas a este ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
