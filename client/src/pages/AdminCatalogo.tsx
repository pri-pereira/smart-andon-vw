/**
 * Página Admin - Gestão de Catálogo de Peças
 * 
 * CRUD completo: Create, Read, Update, Delete
 * Design Premium: Identidade Visual Volkswagen
 * Segurança: Verificação de Permissão Admin
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { useCatalogoPecasSupabase } from '@/hooks/useCatalogoPecasSupabase';
import { useAuthRE } from '@/hooks/useAuthRE';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Check, AlertCircle, ShieldAlert, Lock, Home, FileText } from 'lucide-react';

interface Peca {
  id: string;
  codigo: string;
  nome: string;
  modelo?: string;
  tempo_tacto_segundos?: number;
}

export default function AdminCatalogo() {
  const [, setLocation] = useLocation();
  const { isAdmin, loading: authLoading, isAuthenticated } = useAuthRE();
  const { pecas: pecasHook, loading: loadingPecas } = useCatalogoPecasSupabase();
  
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    modelo: '',
    tempo_tacto_segundos: 600,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (pecasHook) {
      setPecas(pecasHook);
    }
  }, [pecasHook]);

  // Se não estiver autenticado e não estiver carregando, redireciona para login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      modelo: '',
      tempo_tacto_segundos: 600,
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (peca: Peca) => {
    setFormData({
      codigo: peca.codigo,
      nome: peca.nome,
      modelo: peca.modelo || '',
      tempo_tacto_segundos: peca.tempo_tacto_segundos || 600,
    });
    setEditingId(peca.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.codigo || !formData.nome) {
        setError('Código e Nome são obrigatórios');
        setLoading(false);
        return;
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from('catalogo_pecas')
          .update({
            codigo: formData.codigo,
            nome: formData.nome,
            modelo: formData.modelo || null,
            tempo_tacto_segundos: formData.tempo_tacto_segundos,
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess('Peça atualizada com sucesso!');
      } else {
        const { error: insertError } = await supabase
          .from('catalogo_pecas')
          .insert([
            {
              codigo: formData.codigo,
              nome: formData.nome,
              modelo: formData.modelo || null,
              tempo_tacto_segundos: formData.tempo_tacto_segundos,
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Peça cadastrada com sucesso!');
      }

      const { data } = await supabase
        .from('catalogo_pecas')
        .select('*')
        .order('codigo', { ascending: true });

      if (data) setPecas(data);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar peça');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const { error: deleteError } = await supabase
        .from('catalogo_pecas')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPecas(pecas.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      setSuccess('Peça removida com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover peça');
    } finally {
      setLoading(false);
    }
  };

  // Tela de Carregamento
  if (authLoading || (isAuthenticated && !isAdmin && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#001E50] border-t-transparent rounded-full mb-4" />
        <p className="text-lg font-bold text-[#001E50]">Verificando permissões...</p>
      </div>
    );
  }

  // Tela de Acesso Negado
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001E50] to-[#002E7A] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-8 shadow-2xl animate-in zoom-in duration-500 border-t-8 border-red-500">
          <div className="flex justify-center">
            <div className="bg-red-100 p-6 rounded-full">
              <ShieldAlert size={64} className="text-red-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#001E50]">Acesso Negado</h2>
            <p className="text-[#6B7280] font-medium">
              Você não tem permissão de administrador para acessar esta área do sistema.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLocation('/')}
              className="w-full py-4 bg-[#001E50] text-white font-bold rounded-xl hover:bg-[#002E7A] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Home className="h-5 w-5" />
              Voltar para Início
            </button>
            <button
              onClick={() => setLocation('/login')}
              className="w-full py-4 bg-[#F3F4F6] text-[#001E50] font-bold rounded-xl hover:bg-[#E5E7EB] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="h-5 w-5" />
              Entrar com outra conta
            </button>
          </div>
          <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest">Smart Andon VW • Taubaté</p>
        </div>
      </div>
    );
  }

  if (loadingPecas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#001E50] border-t-transparent rounded-full mb-4" />
        <p className="text-lg font-bold text-[#001E50]">Carregando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col">
      <Header title="Administração - Catálogo" showNav={true} />

      <main className="flex-1 p-4 md:p-6 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-4 pb-6 border-b-2 border-[#001E50]/10">
            <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">Gestão de Catálogo</h2>
            <p className="text-base text-[#6B7280] font-medium">Gerencie o catálogo de peças do sistema</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex gap-3 animate-in shake duration-300">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl flex gap-3 animate-in fade-in duration-300">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 font-bold">{success}</p>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#001E50] to-[#002E7A] text-white font-bold rounded-xl hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Peça
            </button>
          )}

          {showForm && (
            <div className="bg-white rounded-2xl border-2 border-[#001E50]/10 p-6 md:p-8 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#001E50]/10">
                <h3 className="text-2xl font-bold text-[#001E50]">{editingId ? 'Editar Peça' : 'Nova Peça'}</h3>
                <button onClick={resetForm} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                  <X className="h-6 w-6 text-[#6B7280]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#001E50] uppercase">Código *</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      placeholder="Ex: P001"
                      className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl focus:border-[#001E50] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#001E50] uppercase">Nome *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Vidro Dianteiro"
                      className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl focus:border-[#001E50] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#001E50] uppercase">Modelo</label>
                    <input
                      type="text"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      placeholder="Ex: Gol/Voyage"
                      className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl focus:border-[#001E50] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#001E50] uppercase">Tempo Tacto (segundos)</label>
                    <input
                      type="number"
                      value={formData.tempo_tacto_segundos}
                      onChange={(e) => setFormData({ ...formData, tempo_tacto_segundos: parseInt(e.target.value) })}
                      placeholder="600"
                      className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl focus:border-[#001E50] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-[#F3F4F6] text-[#001E50] font-bold rounded-xl hover:bg-[#E5E7EB] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border-2 border-[#001E50]/10 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#001E50] to-[#002E7A] text-white">
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Código</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Modelo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Tempo Tacto</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pecas.length > 0 ? (
                    pecas.map((peca, index) => (
                      <tr key={peca.id} className={`border-t border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F3F4F6]'}`}>
                        <td className="px-6 py-4 font-mono font-bold text-[#001E50]">{peca.codigo}</td>
                        <td className="px-6 py-4 font-semibold text-[#001E50]">{peca.nome}</td>
                        <td className="px-6 py-4 text-[#6B7280]">{peca.modelo || '-'}</td>
                        <td className="px-6 py-4 text-[#6B7280]">{peca.tempo_tacto_segundos || 600}s</td>
                        <td className="px-6 py-4 flex gap-2 justify-center">
                          <button onClick={() => handleEdit(peca)} disabled={loading} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"><Edit2 className="h-5 w-5" /></button>
                          <button onClick={() => setDeleteConfirm(peca.id)} disabled={loading} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"><Trash2 className="h-5 w-5" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-[#6B7280] font-medium">Nenhuma peça cadastrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 max-w-sm space-y-4 shadow-2xl animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-bold text-[#001E50]">Confirmar Exclusão</h3>
                <p className="text-[#6B7280]">Tem certeza que deseja remover esta peça? Esta ação não pode ser desfeita.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-[#F3F4F6] text-[#001E50] font-bold rounded-lg hover:bg-[#E5E7EB] transition-all">Cancelar</button>
                  <button onClick={() => handleDelete(deleteConfirm)} disabled={loading} className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all">{loading ? 'Removendo...' : 'Remover'}</button>
                </div>
              </div>
            </div>
          )}
          {/* Link de Apresentação */}
          <div className="text-center pt-6 border-t border-[#001E50]/10">
            <a
              href="https://docs.google.com/presentation/d/1GLFJuvlZP73WOQMz4Klkx03Cr-QdNC39/edit?usp=sharing&ouid=106764730700458304896&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#001E50] font-medium transition-colors"
            >
              <FileText className="h-4 w-4" />
              Ver Apresentação do Projeto
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
