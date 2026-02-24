/**
 * Página Dashboard Logística - Smart Andon com Supabase
 * 
 * Design Premium: Identidade Visual Volkswagen
 * - Interface mobile-first otimizada para tablets
 * - Cards com design moderno e responsivo
 * - Cores VW: Deep Blue (#001E50) e Pure White
 * - DatePicker para filtro por data
 * - Sistema de Ordenação (Urgência, Recentes, Modelo)
 * - Filtro Rápido (Risco de Parada)
 * 
 * OTIMIZAÇÕES:
 * - Optimistic UI: Atualização instantânea sem esperar servidor
 * - Toast discreto: 1 segundo apenas
 * - Performance: Sem re-renderizações desnecessárias
 * - Fuso Horário: America/Sao_Paulo forçado em todas as operações
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import AlertaTacto from '@/components/AlertaTacto';
import { useRegistroAndonSupabase } from '@/hooks/useRegistroAndonSupabase';
import { useAuthRE } from '@/hooks/useAuthRE';
import type { RegistroAndonDB } from '@/lib/supabase';
import { CheckCircle2, Clock, Calendar, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';
import { formatarHorarioLocal } from '@/lib/utils-tempo';

type SortOption = 'urgencia' | 'recentes' | 'modelo';

/**
 * Função Poka-Yoke: Obtém a data de hoje em Brasília (YYYY-MM-DD)
 */
function getHojeBrasilia(): string {
  const agora = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(agora);
}

/**
 * Função Poka-Yoke: Compara se duas datas são o mesmo dia em Brasília
 * Ignora horas - compara apenas YYYY-MM-DD
 */
function isMesmoDiaBrasilia(dataISO: string, dataSelecionada: string): boolean {
  try {
    const data1 = new Date(dataISO);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const data1Brasilia = formatter.format(data1);
    return data1Brasilia === dataSelecionada;
  } catch {
    return false;
  }
}

/**
 * Função: Calcula o tempo decorrido em segundos
 */
function calcularTempoDecorrido(dataCriacao: string): number {
  try {
    const agora = new Date();
    const criacao = new Date(dataCriacao);
    return Math.floor((agora.getTime() - criacao.getTime()) / 1000);
  } catch {
    return 0;
  }
}

/**
 * Função: Calcula o percentual de urgência (0-100)
 */
function calcularPercentualUrgencia(dataCriacao: string, tempoTacto: number = 600): number {
  const tempoDecorrido = calcularTempoDecorrido(dataCriacao);
  return Math.min(100, (tempoDecorrido / tempoTacto) * 100);
}

/**
 * Componente Toast Discreto (1 segundo)
 */
function ToastNotification({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 font-semibold text-sm">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        {message}
      </div>
    </div>
  );
}

export default function LogisticaSupabase() {
  const { registros, loading, error, concluirRegistro } = useRegistroAndonSupabase();
  const { user } = useAuthRE();
  const [, setLocation] = useLocation();
  
  // Estado para Optimistic UI
  const [registrosConcluídosOtimista, setRegistrosConcluídosOtimista] = useState<Set<string>>(new Set());
  
  // Estado para Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // DatePicker state - Inicializado com a data de hoje no fuso de Brasília
  const [dataSelecionada, setDataSelecionada] = useState<string>(getHojeBrasilia());
  
  // Estado de Ordenação e Filtro
  const [sortOption, setSortOption] = useState<SortOption>('urgencia');
  const [showOnlyRisco, setShowOnlyRisco] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filtrar registros pela data selecionada (comparação apenas YYYY-MM-DD em Brasília)
  // Usar useMemo para evitar re-cálculos desnecessários
  const registrosFiltrados = useMemo(() => {
    let filtered = registros
      .filter((r) => isMesmoDiaBrasilia(r.criado_em, dataSelecionada));

    // Aplicar filtro rápido (Risco de Parada)
    if (showOnlyRisco) {
      filtered = filtered.filter((r) => {
        const percentual = calcularPercentualUrgencia(r.criado_em);
        return percentual > 80;
      });
    }

    // Aplicar ordenação
    switch (sortOption) {
      case 'urgencia':
        // Ordena por urgência (menor tempo restante primeiro = maior percentual)
        return filtered.sort((a, b) => {
          const percentualA = calcularPercentualUrgencia(a.criado_em);
          const percentualB = calcularPercentualUrgencia(b.criado_em);
          return percentualB - percentualA; // Descendente (mais urgente primeiro)
        });
      
      case 'recentes':
        // Ordena por mais recentes
        return filtered.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
      
      case 'modelo':
        // Agrupa por modelo (nome_peca)
        return filtered.sort((a, b) => a.nome_peca.localeCompare(b.nome_peca));
      
      default:
        return filtered;
    }
  }, [registros, dataSelecionada, sortOption, showOnlyRisco]);

  const registrosPendentes = useMemo(() => {
    return registrosFiltrados.filter((r) => r.status !== 'concluido' && !registrosConcluídosOtimista.has(r.id));
  }, [registrosFiltrados, registrosConcluídosOtimista]);

  const registrosConcluidos = useMemo(() => {
    return registrosFiltrados.filter((r) => r.status === 'concluido' || registrosConcluídosOtimista.has(r.id));
  }, [registrosFiltrados, registrosConcluídosOtimista]);

  // Mostrar Toast por 1 segundo apenas
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Função otimizada para concluir entrega com Optimistic UI
  const handleConcluir = useCallback(
    async (id: string, nomePeca: string) => {
      if (!user) {
        alert('Usuário não autenticado');
        return;
      }

      // OPTIMISTIC UI: Atualizar estado imediatamente
      setRegistrosConcluídosOtimista((prev) => new Set(prev).add(id));
      setToastMessage(`Entrega de ${nomePeca} concluída!`);
      setShowToast(true);

      // Enviar para o servidor em background (sem bloquear a UI)
      try {
        await concluirRegistro(id, user.id);
        console.log('Entrega concluída no servidor');
      } catch (err) {
        console.error('Erro ao concluir entrega no servidor:', err);
        // Remover do estado otimista se falhar
        setRegistrosConcluídosOtimista((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        setToastMessage('Erro ao concluir entrega');
        setShowToast(true);
      }
    },
    [user, concluirRegistro]
  );

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
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex gap-3">
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
                Filtrar por Data (Brasília)
              </label>
            </div>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#001E50]/20 rounded-lg font-semibold text-[#001E50] focus:outline-none focus:border-[#001E50] transition-colors"
            />
            <p className="text-xs text-[#6B7280] mt-3 font-medium">
              Mostrando {registrosFiltrados.length} registro(s) para {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Ordenação e Filtro Rápido */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Botão de Ordenação */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="w-full md:w-auto px-4 py-3 bg-white border-2 border-[#001E50]/20 hover:border-[#001E50] text-[#001E50] font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-md"
              >
                <ArrowUpDown className="h-5 w-5" />
                Ordenar por: <span className="font-black">{sortOption === 'urgencia' ? 'Urgência' : sortOption === 'recentes' ? 'Recentes' : 'Modelo'}</span>
              </button>
              
              {/* Dropdown Menu */}
              {showSortMenu && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-48 bg-white border-2 border-[#001E50] rounded-lg shadow-xl z-10">
                  <button
                    onClick={() => {
                      setSortOption('urgencia');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-semibold transition-colors ${
                      sortOption === 'urgencia'
                        ? 'bg-[#001E50] text-white'
                        : 'text-[#001E50] hover:bg-[#001E50]/10'
                    }`}
                  >
                    ⚠️ Urgência (Risco Primeiro)
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('recentes');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-semibold transition-colors border-t border-[#001E50]/10 ${
                      sortOption === 'recentes'
                        ? 'bg-[#001E50] text-white'
                        : 'text-[#001E50] hover:bg-[#001E50]/10'
                    }`}
                  >
                    🕐 Mais Recentes
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('modelo');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-semibold transition-colors border-t border-[#001E50]/10 ${
                      sortOption === 'modelo'
                        ? 'bg-[#001E50] text-white'
                        : 'text-[#001E50] hover:bg-[#001E50]/10'
                    }`}
                  >
                    🚗 Modelo de Carro
                  </button>
                </div>
              )}
            </div>

            {/* Filtro Rápido (Toggle) */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#001E50]/20 rounded-lg hover:border-[#001E50] transition-all">
              <AlertTriangle className={`h-5 w-5 ${showOnlyRisco ? 'text-red-600' : 'text-[#6B7280]'}`} />
              <label className="text-sm font-bold text-[#001E50] uppercase tracking-widest cursor-pointer">
                Apenas Risco
              </label>
              <input
                type="checkbox"
                checked={showOnlyRisco}
                onChange={(e) => setShowOnlyRisco(e.target.checked)}
                className="w-5 h-5 cursor-pointer accent-[#001E50]"
              />
            </div>
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
                {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR')}
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
              Lista de Entregas - {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR')}
            </h3>

            {registrosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {registrosFiltrados.map((registro) => {
                  const horario = formatarHorarioLocal(registro.horario);
                  const tempoTactoSegundos = 600;
                  const isConcluido = registro.status === 'concluido' || registrosConcluídosOtimista.has(registro.id);
                  const percentualUrgencia = calcularPercentualUrgencia(registro.criado_em);

                  return (
                    <div 
                      key={registro.id} 
                      className={`rounded-2xl p-6 space-y-4 border-2 transition-all shadow-md hover:shadow-lg ${
                        isConcluido 
                          ? 'border-green-300 bg-green-50' 
                          : percentualUrgencia > 80
                          ? 'border-red-300 bg-red-50'
                          : 'border-[#001E50]/10 bg-white hover:border-[#001E50]/20'
                      }`}
                    >
                      {/* Progress Bar */}
                      {!isConcluido && (
                        <AlertaTacto 
                          dataCriacao={registro.criado_em} 
                          tempoTactoSegundos={tempoTactoSegundos}
                          concluido={false}
                          tempoFinal={0}
                        />
                      )}

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

                      {/* Action Button - Desabilitado se já concluído */}
                      {!isConcluido && (
                        <button
                          onClick={() => handleConcluir(registro.id, registro.nome_peca)}
                          className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold rounded-lg transition-all duration-200"
                        >
                          ✓ Entrega Concluída
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
                  Nenhum registro para {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast Notification - Discreto no canto */}
      <ToastNotification visible={showToast} message={toastMessage} />
    </div>
  );
}
