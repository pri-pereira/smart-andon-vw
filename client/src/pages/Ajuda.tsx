/**
 * Página de Ajuda - Smart Andon com Supabase
 * 
 * Design Premium: Identidade Visual Volkswagen
 * - Interface limpa com fundo branco
 * - Textos em azul VW (#001E50)
 * - Guias para Operador e Logística
 */

import { useState } from 'react';
import Header from '@/components/Header';
import { ChevronDown, ChevronUp, HelpCircle, Users, Truck } from 'lucide-react';

type SecaoAjuda = 'operador' | 'logistica';

export default function Ajuda() {
  const [secaoAberta, setSecaoAberta] = useState<SecaoAjuda>('operador');
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const toggleExpandido = (id: string) => {
    setExpandidos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const secoes = {
    operador: [
      {
        id: 'op-1',
        titulo: '📱 Passo 1: Acessar a Página do Operador',
        conteudo: 'Abra o navegador e acesse a página inicial do Smart Andon. Clique no botão "Operador" (com o ícone de capacete). Você será direcionado para a tela de entrada de dados.'
      },
      {
        id: 'op-2',
        titulo: '🔢 Passo 2: Informar o Número do Tacto',
        conteudo: 'Na tela "INFORME O TACTO", você verá um teclado numérico. Digite os 3 dígitos do seu tacto (número de identificação da sua estação de trabalho). Exemplo: Se seu tacto é 123, clique nos botões 1, 2, 3 na sequência. Clique no botão "CONFIRMAR" para prosseguir.'
      },
      {
        id: 'op-3',
        titulo: '📦 Passo 3: Selecionar a Peça Necessária',
        conteudo: 'Na tela "NÚMERO DA PEÇA", digite o código da peça que você precisa. Conforme você digita, o sistema procura a peça automaticamente. Quando a peça for encontrada, você verá uma mensagem "✓ Peça Encontrada". Clique em "ENVIAR" para registrar o andon.'
      },
      {
        id: 'op-4',
        titulo: '✅ Passo 4: Confirmação de Sucesso',
        conteudo: 'Após clicar em "ENVIAR", você verá uma tela de confirmação com um checkmark verde. O sistema retornará automaticamente à tela inicial. A equipe de logística foi notificada!'
      },
      {
        id: 'op-5',
        titulo: '⏱️ Entendendo o Tempo de Tacto',
        conteudo: 'Tacto = 600 segundos (10 minutos). Verde (0-50%): Fluxo normal. Amarelo (50-80%): Alerta. Vermelho (80-100%): Risco de parada. Vermelho (>100%): Tempo excedido.'
      }
    ],
    logistica: [
      {
        id: 'log-1',
        titulo: '🚚 Passo 1: Acessar o Dashboard',
        conteudo: 'Abra o navegador e acesse a página inicial do Smart Andon. Clique no botão "Logística" (com o ícone de caminhão). Faça login com suas credenciais corporativas (e-mail e senha Volkswagen).'
      },
      {
        id: 'log-2',
        titulo: '📊 Passo 2: Entender a Interface',
        conteudo: 'O Dashboard está dividido em três seções: (1) Estatísticas (cards no topo), (2) Filtro por Data, (3) Lista de Entregas. Use o filtro para visualizar andons de um dia específico.'
      },
      {
        id: 'log-3',
        titulo: '📈 Passo 3: Monitorar a Barra de Progresso',
        conteudo: 'Cada card de entrega contém uma barra de progresso horizontal que mostra o tempo decorrido. Verde: Até 50% (fluxo normal). Amarelo: 50% a 80% (alerta). Vermelho: Acima de 80% (risco de parada). O tempo é exibido em MM:SS.'
      },
      {
        id: 'log-4',
        titulo: '✅ Passo 4: Registrar uma Entrega Concluída',
        conteudo: 'Localize o card da peça que você acabou de entregar. Clique no botão "✓ Entrega Concluída" (botão verde). O sistema registrará a conclusão e atualizará o status do card.'
      },
      {
        id: 'log-5',
        titulo: '🚨 Passo 5: Priorizar Entregas Críticas',
        conteudo: 'Barras Vermelhas indicam entregas atrasadas. Barras Amarelas indicam entregas que precisam de atenção em breve. Barras Verdes indicam entregas dentro do prazo. Priorize as vermelhas para evitar paradas!'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Central de Ajuda" showNav={true} />

      <main className="flex-1 p-4 md:p-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Título */}
          <div className="text-center space-y-4 pb-6 border-b-2 border-[#001E50]/10">
            <div className="flex justify-center">
              <HelpCircle className="h-12 w-12 text-[#001E50]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
              Central de Ajuda
            </h2>
            <p className="text-base text-[#6B7280] font-medium">
              Guias passo a passo para Operadores e Logística
            </p>
          </div>

          {/* Seletor de Seção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Botão Operador */}
            <button
              onClick={() => setSecaoAberta('operador')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                secaoAberta === 'operador'
                  ? 'border-[#001E50] bg-blue-50'
                  : 'border-[#001E50]/10 bg-white hover:border-[#001E50]/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-[#001E50]" />
                <h3 className="text-lg font-bold text-[#001E50]">Guia do Operador</h3>
              </div>
              <p className="text-sm text-[#6B7280]">
                Instruções para registrar andons e solicitar peças
              </p>
            </button>

            {/* Botão Logística */}
            <button
              onClick={() => setSecaoAberta('logistica')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                secaoAberta === 'logistica'
                  ? 'border-[#001E50] bg-blue-50'
                  : 'border-[#001E50]/10 bg-white hover:border-[#001E50]/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-6 w-6 text-[#001E50]" />
                <h3 className="text-lg font-bold text-[#001E50]">Guia da Logística</h3>
              </div>
              <p className="text-sm text-[#6B7280]">
                Instruções para gerenciar entregas e monitorar andons
              </p>
            </button>
          </div>

          {/* Conteúdo da Seção */}
          <div className="space-y-4">
            {secaoAberta === 'operador' && (
              <>
                <h3 className="text-2xl font-bold text-[#001E50] flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Guia do Operador
                </h3>
                <div className="space-y-3">
                  {secoes.operador.map(item => (
                    <div
                      key={item.id}
                      className="border-2 border-[#001E50]/10 rounded-xl overflow-hidden hover:border-[#001E50]/20 transition-all"
                    >
                      <button
                        onClick={() => toggleExpandido(item.id)}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#F3F4F6] transition-colors"
                      >
                        <h4 className="text-left font-bold text-[#001E50]">{item.titulo}</h4>
                        {expandidos[item.id] ? (
                          <ChevronUp className="h-5 w-5 text-[#001E50] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#001E50] flex-shrink-0" />
                        )}
                      </button>
                      {expandidos[item.id] && (
                        <div className="p-4 bg-blue-50 border-t-2 border-[#001E50]/10">
                          <p className="text-[#6B7280] leading-relaxed">{item.conteudo}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {secaoAberta === 'logistica' && (
              <>
                <h3 className="text-2xl font-bold text-[#001E50] flex items-center gap-2">
                  <Truck className="h-6 w-6" />
                  Guia da Logística
                </h3>
                <div className="space-y-3">
                  {secoes.logistica.map(item => (
                    <div
                      key={item.id}
                      className="border-2 border-[#001E50]/10 rounded-xl overflow-hidden hover:border-[#001E50]/20 transition-all"
                    >
                      <button
                        onClick={() => toggleExpandido(item.id)}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#F3F4F6] transition-colors"
                      >
                        <h4 className="text-left font-bold text-[#001E50]">{item.titulo}</h4>
                        {expandidos[item.id] ? (
                          <ChevronUp className="h-5 w-5 text-[#001E50] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#001E50] flex-shrink-0" />
                        )}
                      </button>
                      {expandidos[item.id] && (
                        <div className="p-4 bg-blue-50 border-t-2 border-[#001E50]/10">
                          <p className="text-[#6B7280] leading-relaxed">{item.conteudo}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Seção de Troubleshooting */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Problemas Comuns
            </h3>
            <div className="space-y-3 text-sm text-amber-900">
              <p>
                <strong>Peça não aparece no Dashboard?</strong> Verifique se está visualizando a data correta no filtro. Recarregue a página.
              </p>
              <p>
                <strong>Barra de progresso não atualiza?</strong> Recarregue a página e verifique sua conexão com a internet.
              </p>
              <p>
                <strong>Não consigo fazer login?</strong> Verifique suas credenciais corporativas. Tente redefinir a senha.
              </p>
              <p>
                <strong>Sistema mostra data errada?</strong> O sistema usa o horário de Brasília (UTC-3). Verifique o relógio do seu computador.
              </p>
            </div>
          </div>

          {/* Seção de Contato */}
          <div className="bg-[#001E50] text-white rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold">📞 Suporte Técnico</h3>
            <div className="space-y-2 text-sm">
              <p><strong>E-mail:</strong> suporte@volkswagen.com.br</p>
              <p><strong>Telefone:</strong> (12) 3634-1234</p>
              <p><strong>Horário:</strong> Segunda a sexta, 7h às 17h</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
