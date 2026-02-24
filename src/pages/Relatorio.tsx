/**
 * Página de Relatório Comparativo - Smart Andon
 * 
 * Exibe análise comparativa com:
 * - Volume do Dia vs Histórico (últimos 7 dias)
 * - Gráfico de tendência
 * - Estatísticas detalhadas
 * - Peças com mais alertas de urgência
 * - Tabela detalhada de todos os chamados
 * - Indicador de tempo excedido (> 600s)
 * - Exportação para PDF
 * - Sistema de Ordenação (Urgência, Recentes, Modelo)
 * - Filtro Rápido (Risco de Parada)
 */

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useRelatoriosDiarios } from '@/hooks/useRelatoriosDiarios';
import { FileText, TrendingUp, AlertTriangle, CheckCircle2, Download, Clock, BarChart3, ArrowUpDown } from 'lucide-react';
import { formatarSegundos, formatarHorarioLocal, formatarDataLocal, isMesmoDia } from '@/lib/utils-tempo';

type SortOption = 'urgencia' | 'recentes' | 'modelo';

/**
 * Função: Calcula o percentual de urgência (0-100)
 */
function calcularPercentualUrgencia(dataCriacao: string, tempoTacto: number = 600): number {
  const agora = new Date();
  const criacao = new Date(dataCriacao);
  const tempoDecorrido = Math.floor((agora.getTime() - criacao.getTime()) / 1000);
  return Math.min(100, (tempoDecorrido / tempoTacto) * 100);
}

export default function Relatorio() {
  const { stats, registros, loading, error, gerarRelatorio, exportarPDF } = useRelatoriosDiarios();
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [sortOption, setSortOption] = useState<SortOption>('urgencia');
  const [showOnlyRisco, setShowOnlyRisco] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleMudarData = (novaData: string) => {
    setDataSelecionada(novaData);
    gerarRelatorio(new Date(novaData));
  };

  // Calcular estatísticas dos últimos 7 dias
  const ultimosDias = useMemo(() => {
    const dias: { [key: string]: any } = {};
    
    for (let i = 6; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      const registrosDia = registros.filter(r => {
        return isMesmoDia(r.criado_em, dataStr);
      });
      
      dias[dataStr] = {
        data: dataStr,
        total: registrosDia.length,
        concluidos: registrosDia.filter(r => r.status === 'concluido').length,
        pendentes: registrosDia.filter(r => r.status !== 'concluido').length,
        excedidos: registrosDia.filter(r => r.tempo_total_segundos && r.tempo_total_segundos > 600).length,
      };
    }
    
    return dias;
  }, [registros]);

  // Aplicar ordenação e filtro aos registros
  const registrosOrdenados = useMemo(() => {
    let filtered = registros;

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
        return filtered.sort((a, b) => {
          const percentualA = calcularPercentualUrgencia(a.criado_em);
          const percentualB = calcularPercentualUrgencia(b.criado_em);
          return percentualB - percentualA;
        });
      
      case 'recentes':
        return filtered.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
      
      case 'modelo':
        return filtered.sort((a, b) => a.nome_peca.localeCompare(b.nome_peca));
      
      default:
        return filtered;
    }
  }, [registros, sortOption, showOnlyRisco]);

  const volumeDia = ultimosDias[dataSelecionada]?.total || 0;
  const volumeMedia = Object.values(ultimosDias).reduce((acc, d: any) => acc + d.total, 0) / 7;
  const variacao = ((volumeDia - volumeMedia) / volumeMedia * 100).toFixed(1);

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-[#001E50] border-t-transparent rounded-full mx-auto" />
          <p className="text-lg font-semibold text-[#001E50]">Gerando relatório...</p>
        </div>
      </div>
    );
  }

  const taxaConclusao = stats && stats.total_chamados > 0 
    ? ((stats.chamados_concluidos / stats.total_chamados) * 100).toFixed(1)
    : 0;

  const taxaRisco = stats && stats.total_chamados > 0
    ? ((stats.alertas_urgencia_count / stats.total_chamados) * 100).toFixed(1)
    : 0;

  // Calcular registros com tempo excedido (> 600s)
  const registrosExcedidos = registrosOrdenados.filter(
    (r) => r.tempo_total_segundos && r.tempo_total_segundos > 600
  );

  const tempoTotalExcedido = registrosExcedidos.reduce(
    (acc, r) => acc + (r.tempo_total_segundos || 0),
    0
  );

  const tempoMedioExcedido = registrosExcedidos.length > 0
    ? Math.floor(tempoTotalExcedido / registrosExcedidos.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col">
      <Header title="Relatório Comparativo" showNav={true} />

      <main className="flex-1 p-4 md:p-6 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header com Seletor de Data */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b-2 border-[#001E50]/10">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
                Relatório Comparativo
              </h2>
              <p className="text-base text-[#6B7280] font-medium">
                Análise de Volume: Dia vs Histórico
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-[#001E50]">Data:</label>
                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={(e) => handleMudarData(e.target.value)}
                  className="px-4 py-2 border-2 border-[#001E50]/20 rounded-lg focus:outline-none focus:border-[#001E50] transition-colors"
                />
              </div>
              <button
                onClick={exportarPDF}
                disabled={!stats}
                className="flex items-center gap-2 px-6 py-2 bg-[#001E50] text-white font-bold rounded-lg hover:bg-[#001E50]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Download className="h-5 w-5" />
                Exportar PDF
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-[#FEE2E2] border-l-4 border-[#EF4444] p-4 rounded">
              <p className="text-sm text-[#DC2626] font-semibold">
                ⚠️ Erro: {error}
              </p>
            </div>
          )}

          {/* Análise Comparativa - Volume do Dia vs Histórico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Volume do Dia */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-blue-400/20 hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-2">
                Volume do Dia
              </p>
              <p className="text-5xl md:text-6xl font-black">
                {volumeDia}
              </p>
              <p className="text-sm text-blue-100 mt-3 font-medium">
                {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Média Histórica */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-purple-400/20 hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-100 mb-2">
                Média (7 dias)
              </p>
              <p className="text-5xl md:text-6xl font-black">
                {Math.round(volumeMedia)}
              </p>
              <p className="text-sm text-purple-100 mt-3 font-medium">
                Últimos 7 dias
              </p>
            </div>

            {/* Variação */}
            <div className={`bg-gradient-to-br rounded-2xl p-6 md:p-8 text-white shadow-lg border transition-shadow hover:shadow-xl ${
              parseFloat(variacao) >= 0 
                ? 'from-green-500 to-green-600 border-green-400/20' 
                : 'from-red-500 to-red-600 border-red-400/20'
            }`}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2">
                Variação
              </p>
              <p className="text-5xl md:text-6xl font-black">
                {variacao}%
              </p>
              <p className="text-sm mt-3 font-medium">
                {parseFloat(variacao) >= 0 ? '↑ Acima' : '↓ Abaixo'} da média
              </p>
            </div>
          </div>

          {/* Cards de Resumo Executivo */}
          {stats && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#001E50] flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Resumo Executivo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total de Chamados */}
                <div className="bg-white border-2 border-[#001E50]/10 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-3">
                    Total de Chamados
                  </p>
                  <p className="text-4xl font-black text-[#001E50]">
                    {stats.total_chamados}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-3">
                    Registros do dia
                  </p>
                </div>

                {/* Taxa de Conclusão */}
                <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Taxa de Conclusão
                  </p>
                  <p className="text-4xl font-black text-green-600">
                    {taxaConclusao}%
                  </p>
                  <p className="text-xs text-green-700 mt-3">
                    {stats.chamados_concluidos} de {stats.total_chamados}
                  </p>
                </div>

                {/* Tempo Médio */}
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tempo Médio
                  </p>
                  <p className="text-4xl font-black text-blue-600">
                    {formatarSegundos(stats.tempo_medio_segundos)}
                  </p>
                  <p className="text-xs text-blue-700 mt-3">
                    Média de entrega
                  </p>
                </div>

                {/* Taxa de Risco */}
                <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Taxa de Risco
                  </p>
                  <p className="text-4xl font-black text-red-600">
                    {taxaRisco}%
                  </p>
                  <p className="text-xs text-red-700 mt-3">
                    {stats.alertas_urgencia_count} alertas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de Tendência (Últimos 7 dias) */}
          <div className="bg-white border-2 border-[#001E50]/10 rounded-2xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-[#001E50] mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Tendência (Últimos 7 dias)
            </h3>
            
            <div className="space-y-4">
              {Object.entries(ultimosDias).map(([data, stats]: [string, any]) => {
                const maxVolume = Math.max(...Object.values(ultimosDias).map((d: any) => d.total));
                const percentual = maxVolume > 0 ? (stats.total / maxVolume) * 100 : 0;
                const isHoje = data === dataSelecionada;
                
                return (
                  <div key={data} className={`space-y-2 p-4 rounded-lg ${isHoje ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#001E50]">
                        {new Date(data).toLocaleDateString('pt-BR', { weekday: 'short' })} - {new Date(data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-sm font-bold text-[#6B7280]">
                        {stats.total} registros
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${isHoje ? 'bg-blue-500' : 'bg-[#001E50]'}`}
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-[#6B7280] font-medium">
                      <span>✓ {stats.concluidos} concluídos</span>
                      <span>⏳ {stats.pendentes} pendentes</span>
                      <span>⚠️ {stats.excedidos} excedidos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indicador de Tempo Excedido */}
          {registrosExcedidos.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Tempo Excedido (&gt; 600s)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-xs font-bold text-red-700 uppercase">Quantidade</p>
                  <p className="text-3xl font-black text-red-600 mt-2">{registrosExcedidos.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-xs font-bold text-red-700 uppercase">Tempo Total</p>
                  <p className="text-3xl font-black text-red-600 mt-2">{formatarSegundos(tempoTotalExcedido)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-xs font-bold text-red-700 uppercase">Tempo Médio</p>
                  <p className="text-3xl font-black text-red-600 mt-2">{formatarSegundos(tempoMedioExcedido)}</p>
                </div>
              </div>

              <div className="space-y-2">
                {registrosExcedidos.map((r) => (
                  <div key={r.id} className="bg-white rounded-lg p-3 border border-red-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#001E50]">{r.nome_peca}</p>
                      <p className="text-xs text-[#6B7280]">Código: {r.codigo_peca} | Tacto: {r.tacto}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{formatarSegundos(r.tempo_total_segundos!)}</p>
                      <p className="text-xs text-red-500">+{formatarSegundos(r.tempo_total_segundos! - 600)} acima</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Tabela Detalhada */}
          <div className="bg-white border-2 border-[#001E50]/10 rounded-2xl p-6 shadow-md overflow-x-auto">
            <h3 className="text-2xl font-bold text-[#001E50] mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Detalhes de Todos os Registros ({registrosOrdenados.length})
            </h3>
            
            {registrosOrdenados.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#001E50]/10">
                    <th className="text-left py-3 px-2 font-bold text-[#001E50]">Tacto</th>
                    <th className="text-left py-3 px-2 font-bold text-[#001E50]">Peça</th>
                    <th className="text-left py-3 px-2 font-bold text-[#001E50]">Código</th>
                    <th className="text-left py-3 px-2 font-bold text-[#001E50]">Horário</th>
                    <th className="text-left py-3 px-2 font-bold text-[#001E50]">Status</th>
                    <th className="text-left py-3 px-2 font-bold text-[#001E50]">Tempo (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosOrdenados.map((r) => (
                    <tr key={r.id} className="border-b border-[#001E50]/5 hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-[#001E50]">{r.tacto}</td>
                      <td className="py-3 px-2 text-[#6B7280]">{r.nome_peca}</td>
                      <td className="py-3 px-2 font-mono text-[#001E50]">{r.codigo_peca}</td>
                      <td className="py-3 px-2 text-[#6B7280]">{formatarHorarioLocal(r.horario)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          r.status === 'concluido' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {r.status === 'concluido' ? '✓ Concluído' : '⏳ Pendente'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-bold ${
                          r.tempo_total_segundos && r.tempo_total_segundos > 600
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          {r.tempo_total_segundos ? formatarSegundos(r.tempo_total_segundos) : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-[#6B7280] py-8">Nenhum registro encontrado</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
