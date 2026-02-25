/**
 * Página Operador - Smart Andon VW
 * 
 * Interface de entrada do Operador com:
 * - Seletor de Tacto (número da estação)
 * - Seletor binário de Lado (LD/LE)
 * - Glass-Cards com cores da logística (Azul, Rosa, Amarelo)
 * - Transições suaves com Framer Motion
 * - Design minimalista e touch-friendly
 * 
 * POKA-YOKE: Fuso horário de Brasília (America/Sao_Paulo) forçado em todas as operações
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, HardHat, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';

interface Peca {
  id: string;
  codigo: string;
  nome: string;
  tacto: number;
  cor_logistica: string;
}

type Lado = 'LE' | 'LD' | null;

/**
 * Função para obter a cor do item baseada na cor_logistica
 */
function getCorItem(cor: string): { bg: string; border: string; text: string } {
  const cores: Record<string, { bg: string; border: string; text: string }> = {
    'azul': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900' },
    'rosa': { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-900' },
    'amarelo': { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900' },
    'blue': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900' },
    'pink': { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-900' },
    'yellow': { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900' },
  };
  return cores[cor.toLowerCase()] || { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-900' };
}

/**
 * Dados mockados de peças (será substituído por API/Supabase)
 */
const PECAS_MOCK: Peca[] = [
  {
    id: '1',
    codigo: '6F0 805 588 B',
    nome: 'Farol Dianteiro Esquerdo',
    tacto: 3,
    cor_logistica: 'amarelo',
  },
  {
    id: '2',
    codigo: '5G0 941 700 C',
    nome: 'Lâmpada LED H7',
    tacto: 3,
    cor_logistica: 'azul',
  },
  {
    id: '3',
    codigo: '3M0 415 000 X',
    nome: 'Lâmpada LED H7',
    tacto: 3,
    cor_logistica: 'azul',
  },
  {
    id: '4',
    codigo: '3Q0 413 029 E',
    nome: 'Amortecedor Dianteiro',
    tacto: 3,
    cor_logistica: 'rosa',
  },
];

export default function OperadorSupabase() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'tacto' | 'pecas'>('tacto');
  const [tactoSelecionado, setTactoSelecionado] = useState<number | null>(null);
  const [ladoSelecionado, setLadoSelecionado] = useState<Lado>(null);
  const [pecasSelecionadas, setPecasSelecionadas] = useState<Set<string>>(new Set());

  // Filtrar peças pelo tacto selecionado
  const pecasFiltradas = useMemo(() => {
    if (!tactoSelecionado) return [];
    return PECAS_MOCK.filter((p) => p.tacto === tactoSelecionado);
  }, [tactoSelecionado]);

  // Obter tactos únicos
  const tactos = useMemo(() => {
    return [...new Set(PECAS_MOCK.map((p) => p.tacto))].sort();
  }, []);

  // Função para selecionar uma peça
  const handleSelecionarPeca = (pecaId: string) => {
    setPecasSelecionadas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pecaId)) {
        newSet.delete(pecaId);
      } else {
        newSet.add(pecaId);
      }
      return newSet;
    });
  };

  // Função para confirmar seleção e enviar para logística
  const handleConfirmar = async () => {
    if (!tactoSelecionado || !ladoSelecionado || pecasSelecionadas.size === 0) {
      alert('Selecione Tacto, Lado e pelo menos uma peça');
      return;
    }

    try {
      // Obter as peças selecionadas com seus dados completos
      const pecasParaEnviar = pecasFiltradas.filter(p => pecasSelecionadas.has(p.id));

      const novosRegistros = pecasParaEnviar.map(peca => ({
        tacto: tactoSelecionado,
        lado: ladoSelecionado,
        codigo_peca: peca.codigo,
        nome_peca: peca.nome,
        status: 'pendente'
      }));

      // Inserir no Supabase real
      const { error } = await supabase
        .from('registros')
        .insert(novosRegistros);

      if (error) throw error;

      // Resetar e voltar para home
      alert('Peças enviadas com sucesso!');
      setStep('tacto');
      setTactoSelecionado(null);
      setLadoSelecionado(null);
      setPecasSelecionadas(new Set());
      setLocation('/');
    } catch (err: any) {
      console.error('Erro ao enviar chamados:', err);
      alert('Erro ao enviar para o servidor. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Operador - Entrada de Tacto" showNav={false} />

      <main className="flex-1 p-4 md:p-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* STEP 1: Seleção de Tacto e Lado */}
            {step === 'tacto' && (
              <motion.div
                key="tacto"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
                    Informe os Dados
                  </h2>
                  <p className="text-base text-[#6B7280] font-medium">
                    Selecione a estação de trabalho e o lado
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#001E50]">1. Selecione o Tacto</h3>
                  {/* Grid de Tactos */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tactos.map((tacto) => (
                      <motion.button
                        key={tacto}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTactoSelecionado(tacto)}
                        className={`py-5 px-4 rounded-xl font-black text-2xl transition-all border-2 ${tactoSelecionado === tacto
                            ? 'bg-[#001E50] text-white border-[#001E50] shadow-md'
                            : 'bg-white border-[#001E50]/20 text-[#001E50] hover:border-[#001E50]/50'
                          }`}
                      >
                        TACTO {tacto}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#001E50]">2. Selecione o Lado</h3>
                  {/* Segmented Control - Lado */}
                  <div className="flex gap-4 p-2 bg-[#F3F4F6] rounded-2xl">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLadoSelecionado('LE')}
                      className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all border-2 ${ladoSelecionado === 'LE'
                          ? 'bg-[#001E50] text-white border-[#001E50] shadow-md'
                          : 'bg-white border-transparent text-[#001E50] hover:border-[#001E50]/20'
                        }`}
                    >
                      🔄 LE (Lado Esquerdo)
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLadoSelecionado('LD')}
                      className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all border-2 ${ladoSelecionado === 'LD'
                          ? 'bg-[#001E50] text-white border-[#001E50] shadow-md'
                          : 'bg-white border-transparent text-[#001E50] hover:border-[#001E50]/20'
                        }`}
                    >
                      🔄 LD (Lado Direito)
                    </motion.button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLocation('/')}
                    className="flex-1 w-full py-4 px-4 bg-white border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-xl hover:border-[#001E50] transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('pecas')}
                    disabled={!tactoSelecionado || !ladoSelecionado}
                    className="flex-1 py-4 px-4 bg-[#001E50] text-white font-bold rounded-xl hover:bg-[#001E50]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    Próximo →
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Seleção de Peças na Lista */}
            {step === 'pecas' && (
              <motion.div
                key="pecas"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
                    Selecione as Peças
                  </h2>
                  <p className="text-base text-[#6B7280] font-medium">
                    Tacto {tactoSelecionado} • {ladoSelecionado}
                  </p>
                </div>

                {/* Lista de Peças Clean */}
                <div className="space-y-3">
                  {pecasFiltradas.map((peca) => {
                    const isSelected = pecasSelecionadas.has(peca.id);
                    const cores = getCorItem(peca.cor_logistica);

                    return (
                      <motion.button
                        key={peca.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelecionarPeca(peca.id)}
                        className={`w-full relative overflow-hidden rounded-xl p-4 transition-all border-2 text-left flex items-center justify-between ${isSelected
                            ? `border-[#001E50] shadow-md ${cores.bg}`
                            : `${cores.border} bg-white hover:shadow-sm`
                          }`}
                      >
                        {/* Indicador de cor logística sutil na borda esq */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cores.bg.replace('50', '400')}`} />

                        {/* Content */}
                        <div className="pl-3">
                          {/* Código da Peça */}
                          <p className={`text-xl font-black tracking-tight ${isSelected ? 'text-[#001E50]' : cores.text}`}>
                            {peca.codigo}
                          </p>
                          {/* Nome da Peça */}
                          <p className="text-sm font-semibold text-[#6B7280]">
                            {peca.nome}
                          </p>
                        </div>

                        {/* Checkmark */}
                        <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                            ? 'bg-[#001E50] border-[#001E50] text-white'
                            : 'border-[#6B7280] text-transparent'
                          }`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('tacto')}
                    className="flex-1 py-4 px-4 bg-white border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-xl hover:border-[#001E50] transition-all flex items-center justify-center gap-2"
                  >
                    ← Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmar}
                    disabled={pecasSelecionadas.size === 0}
                    className="flex-1 py-4 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    ✓ Confirmar ({pecasSelecionadas.size})
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
