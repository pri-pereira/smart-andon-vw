import { useEffect, useState } from 'react';
import { formatarSegundosMMSS } from '@/lib/utils-tempo';

interface AlertaTactoProps {
  dataCriacao: string;
  tempoTactoSegundos?: number;
  concluido?: boolean;
  tempoFinal?: number;
}

/**
 * Componente de Barra de Progresso Horizontal - Smart Andon VW
 * 
 * Lógica da Barra:
 * - Preenchimento horizontal conforme o tempo passa (baseado no tacto de 600s).
 * - Cores Dinâmicas:
 *   - Verde: Até 50% do tempo.
 *   - Amarelo: De 50% a 80% (Alerta).
 *   - Vermelho: Acima de 80% (Risco de Parada).
 * - Estilo: Azul Volkswagen (#001E50) para o recipiente.
 * - Texto: Tempo em formato MM:SS por cima da barra.
 */
const AlertaTacto = ({ 
  dataCriacao, 
  tempoTactoSegundos = 600,
  concluido = false,
  tempoFinal = 0
}: AlertaTactoProps) => {
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);

  useEffect(() => {
    // Se concluído, usar o tempo final
    if (concluido) {
      setSegundosDecorridos(tempoFinal > 0 ? tempoFinal : 0);
      return;
    }

    // Se não concluído, continuar contando
    const atualizarContagem = () => {
      const inicio = new Date(dataCriacao).getTime();
      const agora = new Date().getTime();
      const decorridos = Math.floor((agora - inicio) / 1000);
      setSegundosDecorridos(decorridos > 0 ? decorridos : 0);
    };

    atualizarContagem(); // Execução inicial
    const intervalo = setInterval(atualizarContagem, 1000);

    return () => clearInterval(intervalo);
  }, [dataCriacao, concluido, tempoFinal]);

  const percentual = (segundosDecorridos / tempoTactoSegundos) * 100;
  
  // Definição das cores baseada na urgência (Requisitos do Usuário)
  let corPreenchimento = "bg-green-500"; // Verde: Até 50%
  let textoStatus = "FLUXO NORMAL";

  if (percentual > 80) {
    corPreenchimento = "bg-red-500"; // Vermelho: Acima de 80%
    textoStatus = "RISCO DE PARADA";
  } else if (percentual > 50) {
    corPreenchimento = "bg-yellow-400"; // Amarelo: 50% a 80%
    textoStatus = "ALERTA";
  }

  if (concluido) {
    corPreenchimento = "bg-blue-400";
    textoStatus = "CONCLUÍDO";
  }

  return (
    <div className="w-full space-y-2">
      {/* Cabeçalho da Barra: Status e Tempo */}
      <div className="flex justify-between items-end">
        <span className={`text-[10px] font-black tracking-tighter ${concluido ? 'text-gray-400' : 'text-[#001E50]'}`}>
          {textoStatus}
        </span>
        <span className="text-sm font-mono font-bold text-[#001E50]">
          {formatarSegundosMMSS(segundosDecorridos)}
          <span className="text-[10px] text-gray-400 ml-1">/ {formatarSegundosMMSS(tempoTactoSegundos)}</span>
        </span>
      </div>

      {/* Recipiente da Barra (Azul Volkswagen #001E50) */}
      <div className="w-full bg-[#001E50] rounded-full h-4 p-[2px] shadow-inner overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${corPreenchimento} ${!concluido && percentual > 80 ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        >
          {/* Brilho sutil na barra */}
          <div className="w-full h-full bg-white/20 rounded-full"></div>
        </div>
      </div>
      
      {/* Alerta Crítico abaixo da barra se necessário */}
      {!concluido && percentual > 100 && (
        <p className="text-[10px] font-bold text-red-600 animate-bounce text-center">
          ⚠️ TEMPO DE TACTO EXCEDIDO
        </p>
      )}
    </div>
  );
};

export default AlertaTacto;
