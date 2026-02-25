import { useEffect, useState } from 'react';
import { formatarSegundosMMSS } from '@/lib/utils-tempo';
import { motion } from 'framer-motion';

interface AlertaTactoProps {
  dataCriacao: string;
  tempoTactoSegundos?: number;
  status?: string;
  tempoFinal?: number;
}

export default function AlertaTacto({
  dataCriacao,
  tempoTactoSegundos = 600,
  status = 'pendente',
  tempoFinal = 0
}: AlertaTactoProps) {
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);

  const isFinalizado = status === 'concluido' || status === 'entregue';

  useEffect(() => {
    if (isFinalizado) {
      setSegundosDecorridos(tempoFinal > 0 ? tempoFinal : 0);
      return;
    }

    const atualizarContagem = () => {
      const inicio = new Date(dataCriacao).getTime();
      const agora = new Date().getTime();
      const decorridos = Math.floor((agora - inicio) / 1000);
      setSegundosDecorridos(decorridos > 0 ? decorridos : 0);
    };

    atualizarContagem();
    const intervalo = setInterval(atualizarContagem, 1000);

    return () => clearInterval(intervalo);
  }, [dataCriacao, isFinalizado, tempoFinal]);

  const percentualRaw = (segundosDecorridos / tempoTactoSegundos) * 100;
  const percentual = Math.min(percentualRaw, 100);

  // Cores: Verde (0-50%), Amarelo (50-80%), Vermelho (>80%)
  let corPreenchimento = "bg-green-500 shadow-green-500/50";
  let textoStatus = "NO PRAZO";

  if (segundosDecorridos > 480) { // 80% of 600s
    corPreenchimento = "bg-red-500 shadow-red-500/50";
    textoStatus = "RISCO PARADA";
  } else if (segundosDecorridos > 300) { // 50% of 600s
    corPreenchimento = "bg-yellow-400 shadow-yellow-400/50";
    textoStatus = "ALERTA";
  }

  if (status === 'entregue') {
    corPreenchimento = "bg-blue-400 shadow-blue-400/50";
    textoStatus = "ENTREGUE (AGUARDANDO OP)";
  } else if (status === 'concluido') {
    corPreenchimento = "bg-gray-400 shadow-gray-400/50";
    textoStatus = "CONCLUÍDO";
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <span className={`text-[11px] font-black tracking-widest ${isFinalizado ? 'text-gray-400' : 'text-[#001E50]'}`}>
          {textoStatus}
        </span>
        <span className={`text-base font-mono font-black ${isFinalizado ? 'text-gray-400' : 'text-[#001E50]'}`}>
          {formatarSegundosMMSS(segundosDecorridos)}
          <span className="text-[11px] text-gray-400 ml-1">/ {formatarSegundosMMSS(tempoTactoSegundos)}</span>
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 lg:h-4 overflow-hidden shadow-inner relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentual}%` }}
          transition={{ duration: 1, ease: 'linear' }}
          className={`h-full rounded-full ${corPreenchimento} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        >
          {/* Reflexo glass interno */}
          <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
