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

interface Peca {
  id: string;
  codigo: string;
  nome: string;
  tacto: number;
  cor_logistica: string;
}

type Lado = 'LE' | 'LD' | null;

/**
 * Função para obter a cor de fundo do card baseada na cor_logistica
 */
function getCorFundo(cor: string): string {
  const cores: Record<string, string> = {
    'azul': 'from-blue-400 to-cyan-300',
    'rosa': 'from-pink-400 to-rose-300',
    'amarelo': 'from-yellow-400 to-amber-300',
    'blue': 'from-blue-400 to-cyan-300',
    'pink': 'from-pink-400 to-rose-300',
    'yellow': 'from-yellow-400 to-amber-300',
  };
  return cores[cor.toLowerCase()] || 'from-blue-400 to-cyan-300';
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
  const [step, setStep] = useState<'tacto' | 'lado' | 'pecas'>('tacto');
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

    // Aqui seria feito o envio para Supabase
    console.log({
      tacto: tactoSelecionado,
      lado: ladoSelecionado,
      pecas: Array.from(pecasSelecionadas),
    });

    // Resetar e voltar para home
    alert('Peças enviadas com sucesso!');
    setStep('tacto');
    setTactoSelecionado(null);
    setLadoSelecionado(null);
    setPecasSelecionadas(new Set());
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Operador - Entrada de Tacto" showNav={false} />

      <main className="flex-1 p-4 md:p-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* STEP 1: Seleção de Tacto */}
            {step === 'tacto' && (
              <motion.div
                key="tacto"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
                    Selecione o Tacto
                  </h2>
                  <p className="text-base text-[#6B7280] font-medium">
                    Escolha a estação de trabalho
                  </p>
                </div>

                {/* Grid de Tactos */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tactos.map((tacto) => (
                    <motion.button
                      key={tacto}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTactoSelecionado(tacto);
                        setStep('lado');
                      }}
                      className={`py-6 px-4 rounded-2xl font-black text-2xl transition-all ${
                        tactoSelecionado === tacto
                          ? 'bg-[#001E50] text-white shadow-lg'
                          : 'bg-white border-2 border-[#001E50]/20 text-[#001E50] hover:border-[#001E50]/50'
                      }`}
                    >
                      TACTO {tacto}
                    </motion.button>
                  ))}
                </div>

                {/* Botão Voltar */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLocation('/')}
                  className="w-full py-3 px-4 bg-white border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-lg hover:border-[#001E50] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Voltar
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: Seleção de Lado */}
            {step === 'lado' && (
              <motion.div
                key="lado"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
                    Tacto {tactoSelecionado} Selecionado
                  </h2>
                  <p className="text-base text-[#6B7280] font-medium">
                    Escolha o lado (LE/LD)
                  </p>
                </div>

                {/* Segmented Control - Lado */}
                <div className="flex gap-4 p-2 bg-[#F3F4F6] rounded-2xl">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLadoSelecionado('LE')}
                    className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all ${
                      ladoSelecionado === 'LE'
                        ? 'bg-[#001E50] text-white shadow-lg'
                        : 'text-[#001E50] hover:bg-white'
                    }`}
                  >
                    🔄 Lado Esquerdo (LE)
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLadoSelecionado('LD')}
                    className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all ${
                      ladoSelecionado === 'LD'
                        ? 'bg-[#001E50] text-white shadow-lg'
                        : 'text-[#001E50] hover:bg-white'
                    }`}
                  >
                    🔄 Lado Direito (LD)
                  </motion.button>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('tacto')}
                    className="flex-1 py-3 px-4 bg-white border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-lg hover:border-[#001E50] transition-all"
                  >
                    ← Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('pecas')}
                    disabled={!ladoSelecionado}
                    className="flex-1 py-3 px-4 bg-[#001E50] text-white font-bold rounded-lg hover:bg-[#001E50]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    Próximo →
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Seleção de Peças com Glass-Cards */}
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

                {/* Grid de Glass-Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pecasFiltradas.map((peca) => {
                    const isSelected = pecasSelecionadas.has(peca.id);
                    const corGradient = getCorFundo(peca.cor_logistica);

                    return (
                      <motion.button
                        key={peca.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelecionarPeca(peca.id)}
                        className={`relative overflow-hidden rounded-3xl p-6 backdrop-blur-md transition-all ${
                          isSelected
                            ? 'ring-4 ring-[#001E50] shadow-2xl'
                            : 'shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {/* Background com Glassmorphism */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${corGradient} opacity-40 blur-xl`}
                        />
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

                        {/* Content */}
                        <div className="relative z-10 space-y-3 text-left">
                          {/* Código da Peça */}
                          <p className="text-2xl font-black text-[#001E50] tracking-tight">
                            {peca.codigo}
                          </p>

                          {/* Nome da Peça */}
                          <p className="text-sm font-semibold text-[#6B7280]">
                            {peca.nome}
                          </p>

                          {/* Indicador de Seleção */}
                          {isSelected && (
                            <div className="flex items-center gap-2 text-[#001E50] font-bold">
                              <div className="h-5 w-5 bg-[#001E50] rounded-full flex items-center justify-center text-white text-sm">
                                ✓
                              </div>
                              Selecionado
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('lado')}
                    className="flex-1 py-3 px-4 bg-white border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-lg hover:border-[#001E50] transition-all"
                  >
                    ← Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmar}
                    disabled={pecasSelecionadas.size === 0}
                    className="flex-1 py-3 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
