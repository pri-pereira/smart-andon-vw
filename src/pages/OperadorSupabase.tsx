import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, ArrowLeft, CheckCircle2, Box, PackageCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { useAuthRE } from '@/hooks/useAuthRE';
import { useRegistroAndonSupabase } from '@/hooks/useRegistroAndonSupabase';
import { formatarHorarioLocal } from '@/lib/utils-tempo';

interface Peca {
  id: string;
  codigo: string;
  nome: string;
  tacto: number;
  cor_logistica: string;
}

const PECAS_MOCK: Peca[] = [
  { id: '1', codigo: '6F0 805 588 B', nome: 'Farol Dianteiro Esquerdo', tacto: 3, cor_logistica: 'amarelo' },
  { id: '2', codigo: '5G0 941 700 C', nome: 'Lâmpada LED', tacto: 3, cor_logistica: 'azul' },
  { id: '3', codigo: '3M0 415 000 X', nome: 'Lanterna Traseira', tacto: 3, cor_logistica: 'azul' },
  { id: '4', codigo: '3Q0 413 029 E', nome: 'Amortecedor Dianteiro', tacto: 3, cor_logistica: 'rosa' },
];

function getPastelColor(cor: string) {
  const map: any = {
    'azul': 'bg-blue-50 border-blue-200 text-blue-900',
    'rosa': 'bg-pink-50 border-pink-200 text-pink-900',
    'amarelo': 'bg-yellow-50 border-yellow-200 text-yellow-900',
  };
  return map[cor.toLowerCase()] || 'bg-gray-50 border-gray-200 text-gray-900';
}

export default function OperadorSupabase() {
  const [, setLocation] = useLocation();
  const { user, login } = useAuthRE();
  const { registros, adicionarRegistro, concluirRegistro } = useRegistroAndonSupabase();

  const [step, setStep] = useState<'login' | 'tacto' | 'pecas'>('login');
  const [reInput, setReInput] = useState('');
  const [tactoSelecionado, setTactoSelecionado] = useState<number | null>(null);
  const [ladoSelecionado, setLadoSelecionado] = useState<'LE' | 'LD' | null>(null);

  // Entregas para Double Check
  const minhasEntregasAguardando = registros.filter(
    r => r.status === 'entregue' && r.tacto === tactoSelecionado
  );

  useEffect(() => {
    if (user) {
      setStep('tacto');
    } else {
      setStep('login');
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (reInput.trim().length > 3) {
      if (login(reInput)) {
        setStep('tacto');
      }
    }
  };

  const tactos = useMemo(() => [...new Set(PECAS_MOCK.map(p => p.tacto))].sort(), []);

  const pecasFiltradas = useMemo(() => {
    if (!tactoSelecionado) return [];
    return PECAS_MOCK.filter(p => p.tacto === tactoSelecionado);
  }, [tactoSelecionado]);

  const handlePedirPeca = async (peca: Peca) => {
    if (!tactoSelecionado || !ladoSelecionado) return;

    // Envio instantâneo
    await adicionarRegistro({
      tacto: tactoSelecionado,
      lado: ladoSelecionado,
      codigo_peca: peca.codigo,
      nome_peca: peca.nome,
      celula: 'Vidros',
      status: 'pendente'
    });
  };

  const handleConfirmarRecebimento = async (id: string) => {
    if (!user) return;
    await concluirRegistro(id, user.id);
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Operador Andon" showNav={false} />

      <main className="max-w-3xl mx-auto p-4 md:p-6 pb-32">
        <AnimatePresence mode="wait">

          {step === 'login' && (
            <motion.div
              key="login"
              initial="initial" animate="in" exit="out" variants={pageVariants}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center pt-20"
            >
              <div className="w-full max-w-sm bg-white/50 backdrop-blur-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,30,80,0.15)] rounded-3xl p-8">
                <Box className="w-16 h-16 text-[#001E50] mx-auto mb-6 opacity-90 animate-bounce" />
                <h2 className="text-3xl font-black text-[#001E50] text-center mb-2 tracking-tighter">Acesso Rápido</h2>
                <p className="text-gray-500 text-center mb-8 font-medium">Informe o RE para prosseguir</p>

                <form onSubmit={handleLogin} className="space-y-6">
                  <input
                    type="number"
                    value={reInput}
                    onChange={(e) => setReInput(e.target.value)}
                    placeholder="Ex: 1234"
                    className="w-full text-center text-4xl font-black text-[#001E50] py-4 border-2 border-gray-200 rounded-2xl focus:border-[#001E50] focus:ring-0 outline-none transition-colors shadow-inner bg-gray-50"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={reInput.length === 0}
                    className="w-full py-4 bg-[#001E50] text-white font-bold text-lg rounded-2xl hover:bg-[#001E50]/90 shadow-lg disabled:opacity-50 transition-all active:scale-95"
                  >
                    Entrar
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'tacto' && (
            <motion.div
              key="tacto"
              initial="initial" animate="in" exit="out" variants={pageVariants}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 pt-4">
                <h2 className="text-4xl md:text-5xl font-black text-[#001E50] uppercase tracking-tighter">Estação</h2>
                <p className="text-gray-500 font-bold">RE Logado: {user?.id}</p>
              </div>

              <section className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,30,80,0.1)] p-6 md:p-8 rounded-3xl space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#001E50] mb-4">1. Selecione o Tacto</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {tactos.map(t => (
                      <button
                        key={t}
                        onClick={() => setTactoSelecionado(t)}
                        className={`py-8 rounded-3xl border-2 font-black text-4xl transition-all shadow-sm active:scale-95 ${tactoSelecionado === t ? 'bg-[#001E50] text-white border-[#001E50] shadow-[0_10px_20px_-10px_rgba(0,30,80,0.5)]' : 'bg-gray-50 text-[#001E50] border-gray-200 hover:border-[#001E50]/50'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#001E50] mb-4">2. Selecione o Lado</h3>
                  <div className="flex gap-4 h-36">
                    <button
                      onClick={() => setLadoSelecionado('LE')}
                      className={`flex-1 rounded-3xl border-2 font-black text-3xl md:text-4xl transition-all shadow-sm active:scale-95 flex flex-col items-center justify-center gap-2 ${ladoSelecionado === 'LE' ? 'bg-[#001E50] text-white border-[#001E50] shadow-[0_10px_20px_-10px_rgba(0,30,80,0.5)]' : 'bg-gray-50 text-[#001E50] border-gray-200 hover:border-[#001E50]/50'
                        }`}
                    >
                      <span className="text-5xl opacity-80">⬅️</span>
                      LE
                    </button>
                    <button
                      onClick={() => setLadoSelecionado('LD')}
                      className={`flex-1 rounded-3xl border-2 font-black text-3xl md:text-4xl transition-all shadow-sm active:scale-95 flex flex-col items-center justify-center gap-2 ${ladoSelecionado === 'LD' ? 'bg-[#001E50] text-white border-[#001E50] shadow-[0_10px_20px_-10px_rgba(0,30,80,0.5)]' : 'bg-gray-50 text-[#001E50] border-gray-200 hover:border-[#001E50]/50'
                        }`}
                    >
                      <span className="text-5xl opacity-80">➡️</span>
                      LD
                    </button>
                  </div>
                </div>
              </section>

              <div className="flex gap-4">
                <button
                  onClick={() => setLocation('/')}
                  className="w-1/3 py-5 bg-gray-100 text-[#001E50] font-bold text-lg rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setStep('pecas')}
                  disabled={!tactoSelecionado || !ladoSelecionado}
                  className="w-2/3 py-5 bg-[#001E50] text-white font-bold text-xl rounded-2xl disabled:opacity-50 shadow-[0_10px_20px_-10px_rgba(0,30,80,0.4)] active:scale-95 transition-all flex justify-center items-center gap-2"
                >
                  Avançar <ChevronRight />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'pecas' && (
            <motion.div
              key="pecas"
              initial="initial" animate="in" exit="out" variants={pageVariants}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mt-4 mb-8">
                <button
                  onClick={() => setStep('tacto')}
                  className="p-4 bg-gray-100 text-[#001E50] rounded-full hover:bg-gray-200 shadow-sm active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-black text-[#001E50] uppercase tracking-tighter">Peças</h2>
                  <p className="font-bold text-gray-500 bg-gray-100 px-4 py-1 rounded-full inline-block mt-2">Tacto {tactoSelecionado} • Lado {ladoSelecionado}</p>
                </div>
                <div className="w-14"></div>
              </div>

              {/* Double Check Section - Pedidos Entregues aguardando */}
              {minhasEntregasAguardando.length > 0 && (
                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <PackageCheck className="text-blue-600 w-8 h-8" />
                    <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight">Confirme o Recebimento</h3>
                  </div>
                  <div className="space-y-3">
                    {minhasEntregasAguardando.map(r => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4"
                      >
                        <div>
                          <p className="font-black text-2xl text-[#001E50] tracking-tighter">{r.codigo_peca}</p>
                          <p className="text-sm font-semibold text-gray-500">{r.nome_peca} • {formatarHorarioLocal(r.horario)}</p>
                        </div>
                        <button
                          onClick={() => handleConfirmarRecebimento(r.id)}
                          className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-lg"
                        >
                          <CheckCircle2 /> Confirmar
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Lista Dinâmica de Peças (Pastel Cards) */}
              <div className="grid grid-cols-1 gap-4">
                {pecasFiltradas.map(p => {
                  const style = getPastelColor(p.cor_logistica);
                  const emAndamento = registros.find(
                    r => r.codigo_peca === p.codigo && r.tacto === tactoSelecionado && r.lado === ladoSelecionado && (r.status === 'pendente' || r.status === 'entregue')
                  );

                  return (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      key={p.id}
                      disabled={!!emAndamento}
                      onClick={() => handlePedirPeca(p)}
                      className={`relative w-full text-left p-6 md:p-8 border-2 rounded-3xl shadow-sm transition-all flex flex-col justify-center min-h-[140px] overflow-hidden ${emAndamento
                          ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                          : `${style} hover:shadow-lg`
                        }`}
                    >
                      {/* Reflexo glass light effect */}
                      {!emAndamento && <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />}

                      <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">{p.codigo}</p>
                        <p className="text-xl font-bold opacity-80 mt-1 uppercase tracking-wide">{p.nome}</p>
                      </div>

                      {emAndamento && (
                        <div className="absolute top-6 right-6 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full uppercase shadow-lg">
                          {emAndamento.status === 'pendente' ? 'A caminho 🚚' : 'No local 📦'}
                        </div>
                      )}
                      {!emAndamento && (
                        <div className="absolute bottom-6 right-6 bg-black/5 text-black/50 w-12 h-12 rounded-full flex items-center justify-center border-2 border-black/10 backdrop-blur-sm shadow-inner group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
