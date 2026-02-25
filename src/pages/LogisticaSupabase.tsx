/**
 * Página Dashboard Logística - Smart Andon com Supabase
 * 
 * Design Premium: Identidade Visual Volkswagen
 * - Interface mobile-first otimizada para tablets
 * - Cards com design moderno e responsivo
 * - Cores VW: Deep Blue (#001E50) e Pure White
 * - DatePicker para filtro por data
 */

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import AlertaTacto from '@/components/AlertaTacto';
import SuccessCheckmark from '@/components/SuccessCheckmark';
import { useRegistroAndonSupabase } from '@/hooks/useRegistroAndonSupabase';
import { useAuthRE } from '@/hooks/useAuthRE';
import type { RegistroAndonDB } from '@/lib/supabase';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';
import { formatarHorarioLocal, isMesmoDia, getHojeBrasilia, getDataISObrasilia } from '@/lib/utils-tempo';

export default function LogisticaSupabase() {
  const { registros, loading, error, concluirRegistro } = useRegistroAndonSupabase();
  const { user } = useAuthRE();
  const [, setLocation] = useLocation();
  const [registrosOrdenados, setRegistrosOrdenados] = useState<RegistroAndonDB[]>([]);
  const [concluindoId, setConcluindoId] = useState<string | null>(null);
  const [showSuccessCheckmark, setShowSuccessCheckmark] = useState(false);
  const [sucessoMensagem, setSucessoMensagem] = useState('');

  // DatePicker state - Inicializado com a data de hoje no fuso de Brasília
  const [dataSelecionada, setDataSelecionada] = useState<string>(
    getHojeBrasilia()
  );

  useEffect(() => {
    const ordenados = [...registros].sort(
      (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
    );
    setRegistrosOrdenados(ordenados);
  }, [registros]);

  // Filtrar registros pela data selecionada (comparação no fuso de Brasília)
  const registrosFiltrados = registrosOrdenados.filter((r) => {
    // Comparar com a data no fuso correto (Brasília) em vez de UTC
    const dataRegistro = getDataISObrasilia(r.criado_em);
    return dataRegistro === dataSelecionada;
  });

  const registrosPendentes = registrosFiltrados.filter(
    (r) => r.status !== 'concluido'
  );

  const registrosConcluidos = registrosFiltrados.filter(
    (r) => r.status === 'concluido'
  );

  const handleConcluir = async (id: string, nomePeca: string) => {
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    setConcluindoId(id);
    try {
      const sucesso = await concluirRegistro(id, user.id);
      if (sucesso) {
        setSucessoMensagem(`Entrega de ${nomePeca} concluída!`);
        setShowSuccessCheckmark(true);

        setTimeout(() => {
          setShowSuccessCheckmark(false);
          setConcluindoId(null);
        }, 1500);
      } else {
        alert('Erro ao concluir entrega');
        setConcluindoId(null);
      }
    } catch (err) {
      alert('Erro ao concluir entrega');
      setConcluindoId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-[#001E50]/10 p-6 rounded-2xl">
              <img
                src="/vw-logo.png"
                alt="Volkswagen"
                className="h-16 w-16 md:h-20 md:w-20 object-contain opacity-50 animate-pulse"
              />
            </div>
          </div>
          <div className="animate-spin h-12 w-12 border-4 border-[#001E50] border-t-transparent rounded-full mx-auto" />
          <p className="text-lg font-bold text-[#001E50]">Carregando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Dashboard - Logística" showNav={true} />

      <main className="flex-1 p-4 md:p-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Título e Logo */}
          <div className="text-center space-y-4 pb-6 border-b-2 border-[#001E50]/10">
            <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
              Registros de Andon
            </h2>
            <p className="text-base text-[#6B7280] font-medium">
              Controle em tempo real de entregas da Célula de Vidros
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex gap-3 animate-in shake duration-300">
              <div className="text-red-600 text-2xl">⚠️</div>
              <div>
                <p className="text-sm font-bold text-red-800">Erro ao carregar dados</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* DatePicker Filter */}
          <div className="bg-white border-2 border-[#001E50]/10 rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-[#001E50]" />
              <label className="text-sm font-bold text-[#001E50] uppercase tracking-widest">
                Filtrar por Data
              </label>
            </div>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#001E50]/20 rounded-lg font-semibold text-[#001E50] focus:outline-none focus:border-[#001E50] transition-colors"
            />
            <p className="text-xs text-[#6B7280] mt-3 font-medium">
              Mostrando {registrosFiltrados.length} registro(s) para {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            </p>
          </div>

          {/* Statistics Cards - Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total */}
            <div className="bg-gradient-to-br from-[#001E50] to-[#002E7A] rounded-2xl p-6 md:p-8 text-white shadow-lg border border-[#001E50]/20 hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-2">
                Total (Data Selecionada)
              </p>
              <p className="text-5xl md:text-6xl font-black">
                {registrosFiltrados.length}
              </p>
              <p className="text-sm text-blue-100 mt-3 font-medium">
                {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </div>

            {/* Concluídos */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-green-400/20 hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold uppercase tracking-widest text-green-100 mb-2">
                Concluídos
              </p>
              <p className="text-5xl md:text-6xl font-black">
                {registrosConcluidos.length}
              </p>
              <p className="text-sm text-green-100 mt-3 font-medium">
                Entregas finalizadas
              </p>
            </div>

            {/* Pendentes */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-amber-400/20 hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-100 mb-2">
                Pendentes
              </p>
              <p className="text-5xl md:text-6xl font-black">
                {registrosPendentes.length}
              </p>
              <p className="text-sm text-amber-100 mt-3 font-medium">
                Aguardando conclusão
              </p>
            </div>
          </div>

          {/* Registros List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#001E50] flex items-center gap-2">
              <div className="h-1 w-1 bg-[#001E50] rounded-full" />
              Lista de Entregas - {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            </h3>

            {registrosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {registrosFiltrados.map((registro) => {
                  const horario = formatarHorarioLocal(registro.horario);
                  const tempoTactoSegundos = 600;
                  const isConcluido = registro.status === 'concluido';

                  return (
                    <div
                      key={registro.id}
                      className={`rounded-2xl p-6 space-y-4 border-2 transition-all shadow-md hover:shadow-lg ${isConcluido
                          ? 'border-green-300 bg-green-50'
                          : 'border-[#001E50]/10 bg-white hover:border-[#001E50]/20'
                        }`}
                    >
                      {/* Progress Bar (Sempre visível conforme solicitado) */}
                      <AlertaTacto
                        dataCriacao={registro.criado_em}
                        tempoTactoSegundos={tempoTactoSegundos}
                        concluido={isConcluido}
                        tempoFinal={registro.tempo_total_segundos || 0}
                      />

                      {/* Status Concluído */}
                      {isConcluido && (
                        <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-green-800 text-sm">Entrega Concluída</p>
                            <p className="text-xs text-green-700">
                              {registro.concluido_em && formatarHorarioLocal(registro.concluido_em)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#F3F4F6] rounded-lg p-3">
                          <p className="text-xs font-bold text-[#6B7280] uppercase">Tacto</p>
                          <p className="font-mono font-black text-[#001E50] text-lg mt-1">{registro.tacto}</p>
                        </div>
                        <div className="bg-[#F3F4F6] rounded-lg p-3">
                          <p className="text-xs font-bold text-[#6B7280] uppercase">Código</p>
                          <p className="font-mono font-black text-[#001E50] text-lg mt-1">{registro.codigo_peca}</p>
                        </div>
                        <div className="col-span-2 bg-[#F3F4F6] rounded-lg p-3">
                          <p className="text-xs font-bold text-[#6B7280] uppercase">Peça</p>
                          <p className="font-bold text-[#001E50] mt-1 truncate">{registro.nome_peca}</p>
                        </div>
                        <div className="bg-[#F3F4F6] rounded-lg p-3">
                          <p className="text-xs font-bold text-[#6B7280] uppercase">Horário</p>
                          <p className="font-mono text-[#6B7280] text-xs mt-1">{horario}</p>
                        </div>
                        <div className="bg-green-100 rounded-lg p-3">
                          <p className="text-xs font-bold text-green-700 uppercase">Célula</p>
                          <p className="font-bold text-green-800 text-xs mt-1">{registro.celula}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isConcluido && (
                        <button
                          onClick={() => handleConcluir(registro.id, registro.nome_peca)}
                          disabled={concluindoId === registro.id}
                          className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                          {concluindoId === registro.id ? 'Concluindo...' : '✓ Entrega Concluída'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-[#001E50]/20">
                <Clock className="h-12 w-12 text-[#6B7280] mx-auto mb-4 opacity-50" />
                <p className="text-[#6B7280] font-semibold">
                  Nenhum registro para {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Success Checkmark */}
      <SuccessCheckmark
        visible={showSuccessCheckmark}
        message={sucessoMensagem}
      />
    </div>
  );
}
