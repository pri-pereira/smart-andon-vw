import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';

interface Peca {
  id: string;
  codigo: string;
  nome: string;
  tacto: number;
  cor_logistica: string;
}

const PECAS_MOCK: Peca[] = [
  { id: '1', codigo: '6F0 805 588 B', nome: 'Farol Dianteiro Esquerdo', tacto: 3, cor_logistica: 'amarelo' },
  { id: '2', codigo: '5G0 941 700 C', nome: 'Lâmpada LED H7', tacto: 3, cor_logistica: 'azul' },
  { id: '3', codigo: '3M0 415 000 X', nome: 'Lâmpada LED H7', tacto: 3, cor_logistica: 'azul' },
  { id: '4', codigo: '3Q0 413 029 E', nome: 'Amortecedor Dianteiro', tacto: 3, cor_logistica: 'rosa' },
];

function getBgColor(cor: string) {
  const map: any = {
    'azul': 'bg-blue-50 border-blue-300',
    'rosa': 'bg-pink-50 border-pink-300',
    'amarelo': 'bg-yellow-50 border-yellow-300',
  };
  return map[cor.toLowerCase()] || 'bg-gray-50 border-gray-300';
}

function getIndicatorColor(cor: string) {
  const map: any = {
    'azul': 'bg-blue-500',
    'rosa': 'bg-pink-500',
    'amarelo': 'bg-yellow-500',
  };
  return map[cor.toLowerCase()] || 'bg-gray-500';
}

export default function OperadorSupabase() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'tacto' | 'pecas'>('tacto');
  const [tactoSelecionado, setTactoSelecionado] = useState<number | null>(null);
  const [ladoSelecionado, setLadoSelecionado] = useState<'LE' | 'LD' | null>(null);
  const [pecasSelecionadas, setPecasSelecionadas] = useState<Set<string>>(new Set());

  const tactos = useMemo(() => [...new Set(PECAS_MOCK.map(p => p.tacto))].sort(), []);

  const pecasFiltradas = useMemo(() => {
    if (!tactoSelecionado) return [];
    return PECAS_MOCK.filter(p => p.tacto === tactoSelecionado);
  }, [tactoSelecionado]);

  const togglePeca = (id: string) => {
    setPecasSelecionadas(prev => {
      const p = new Set(prev);
      p.has(id) ? p.delete(id) : p.add(id);
      return p;
    });
  };

  const handleConfirmar = async () => {
    if (!tactoSelecionado || !ladoSelecionado || pecasSelecionadas.size === 0) return;

    try {
      const paraEnviar = pecasFiltradas.filter(p => pecasSelecionadas.has(p.id)).map(p => ({
        tacto: tactoSelecionado,
        lado: ladoSelecionado,
        codigo_peca: p.codigo,
        nome_peca: p.nome,
        status: 'pendente'
      }));

      const { error } = await supabase.from('registros').insert(paraEnviar);
      if (error) throw error;

      alert('Chamado registrado com sucesso!');
      setLocation('/');
    } catch (e) {
      console.error(e);
      alert('Erro ao registrar.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Operador" showNav={false} />

      <main className="max-w-2xl mx-auto p-6 pb-24">
        {step === 'tacto' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-4xl font-black text-[#001E50] text-center uppercase tracking-tighter">1. Dados da Estação</h2>

            <section className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-[#001E50] mb-4">Selecione o Tacto</h3>
              <div className="grid grid-cols-3 gap-4">
                {tactos.map(t => (
                  <button
                    key={t}
                    onClick={() => setTactoSelecionado(t)}
                    className={`py-4 px-2 rounded-xl border-2 font-black text-2xl transition-all ${tactoSelecionado === t ? 'bg-[#001E50] text-white border-[#001E50]' : 'bg-white text-[#001E50] border-[#001E50]/20'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-[#001E50] mb-4">Selecione o Lado</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setLadoSelecionado('LE')}
                  className={`flex-1 py-4 rounded-xl border-2 font-black text-xl transition-all ${ladoSelecionado === 'LE' ? 'bg-[#001E50] text-white border-[#001E50]' : 'bg-white text-[#001E50] border-[#001E50]/20'
                    }`}
                >
                  LE (Esquerdo)
                </button>
                <button
                  onClick={() => setLadoSelecionado('LD')}
                  className={`flex-1 py-4 rounded-xl border-2 font-black text-xl transition-all ${ladoSelecionado === 'LD' ? 'bg-[#001E50] text-white border-[#001E50]' : 'bg-white text-[#001E50] border-[#001E50]/20'
                    }`}
                >
                  LD (Direito)
                </button>
              </div>
            </section>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setLocation('/')}
                className="w-1/3 py-4 border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft /> Voltar
              </button>
              <button
                onClick={() => setStep('pecas')}
                disabled={!tactoSelecionado || !ladoSelecionado}
                className="w-2/3 py-4 bg-[#001E50] text-white font-bold rounded-xl flex justify-center items-center gap-2 disabled:opacity-50"
              >
                Continuar <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 'pecas' && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <h2 className="text-4xl font-black text-[#001E50] text-center uppercase tracking-tighter">2. Selecione as Peças</h2>
            <p className="text-center font-bold text-gray-500 bg-gray-100 p-3 rounded-xl border border-gray-200">
              Tacto: {tactoSelecionado} • Lado: {ladoSelecionado}
            </p>

            <div className="space-y-4">
              {pecasFiltradas.map(p => {
                const checked = pecasSelecionadas.has(p.id);
                const styles = getBgColor(p.cor_logistica);
                const indicator = getIndicatorColor(p.cor_logistica);

                return (
                  <button
                    key={p.id}
                    onClick={() => togglePeca(p.id)}
                    className={`relative w-full text-left p-5 border-2 rounded-2xl flex items-center justify-between transition-all ${checked ? `border-[#001E50] shadow-md ${styles}` : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl ${indicator}`}></div>
                    <div className="pl-4">
                      <p className={`text-2xl font-black ${checked ? 'text-[#001E50]' : 'text-gray-900'}`}>{p.codigo}</p>
                      <p className="text-sm font-semibold text-gray-500 uppercase mt-1">{p.nome}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex justify-center items-center ${checked ? 'bg-[#001E50] border-[#001E50] text-white' : 'border-gray-300 text-transparent'
                      }`}>
                      ✓
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('tacto')}
                className="w-1/3 py-4 border-2 border-[#001E50]/20 text-[#001E50] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft /> Voltar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={pecasSelecionadas.size === 0}
                className="w-2/3 py-4 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-xl disabled:bg-gray-300"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
