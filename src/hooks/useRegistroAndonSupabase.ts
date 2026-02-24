/**
 * Hook: useRegistroAndonSupabase
 * 
 * Gerencia registros de andon com Supabase Realtime
 * Sincronização automática com banco de dados PostgreSQL
 * Inclui rastreabilidade de conclusão e tempo total
 * 
 * POKA-YOKE: Fuso horário de Brasília (America/Sao_Paulo) forçado em todas as operações
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase, type RegistroAndonDB } from '@/lib/supabase';

interface UseRegistroAndonReturn {
  registros: RegistroAndonDB[];
  loading: boolean;
  error: string | null;
  adicionarRegistro: (registro: Omit<RegistroAndonDB, 'id' | 'criado_em' | 'horario'>) => Promise<RegistroAndonDB | null>;
  concluirRegistro: (id: string, usuarioId: string) => Promise<boolean>;
  carregarRegistros: () => Promise<void>;
}

/**
 * Função Poka-Yoke: Obtém a data/hora atual em Brasília (America/Sao_Paulo)
 * Força o fuso horário correto em todas as operações
 */
function getDataHoraBrasilia(): string {
  const agora = new Date();
  // Converter para string ISO em Brasília
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const [dataPart, horaPart] = formatter.format(agora).split(', ');
  return `${dataPart}T${horaPart}.000Z`;
}

export function useRegistroAndonSupabase(): UseRegistroAndonReturn {
  const [registros, setRegistros] = useState<RegistroAndonDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar registros ao montar
  useEffect(() => {
    carregarRegistros();
  }, []);

  const carregarRegistros = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('registros_andon')
        .select('*')
        .order('criado_em', { ascending: false });

      if (err) {
        console.error('Erro ao carregar registros:', err);
        throw err;
      }
      setRegistros(data || []);
      setError(null);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar registros';
      setError(mensagem);
      console.error('Erro ao carregar registros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Configurar Realtime subscription para INSERT e UPDATE
  useEffect(() => {
    const subscription = supabase
      .channel('registros_andon_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'registros_andon',
        },
        (payload) => {
          console.log('Novo registro de andon:', payload);
          const novoRegistro = payload.new as RegistroAndonDB;
          setRegistros((prev) => {
            // Evitar duplicados se o insert retornar antes da subscrição
            if (prev.some(r => r.id === novoRegistro.id)) return prev;
            return [novoRegistro, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'registros_andon',
        },
        (payload) => {
          console.log('Registro atualizado via Realtime:', payload);
          const registroAtualizado = payload.new as RegistroAndonDB;
          setRegistros((prev) =>
            prev.map((r) => (r.id === registroAtualizado.id ? registroAtualizado : r))
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const adicionarRegistro = useCallback(
    async (
      registro: Omit<RegistroAndonDB, 'id' | 'criado_em' | 'horario'>
    ): Promise<RegistroAndonDB | null> => {
      try {
        // POKA-YOKE: Usar fuso horário de Brasília
        const agoraBrasilia = getDataHoraBrasilia();
        
        console.log('Enviando registro para Supabase (Brasília):', {
          ...registro,
          horario: agoraBrasilia,
          criado_em: agoraBrasilia,
          status: 'pendente',
        });

        const { data, error: err } = await supabase
          .from('registros_andon')
          .insert([
            {
              tacto: registro.tacto,
              codigo_peca: registro.codigo_peca,
              nome_peca: registro.nome_peca,
              celula: registro.celula,
              horario: agoraBrasilia,
              criado_em: agoraBrasilia,
              status: 'pendente',
            },
          ])
          .select()
          .single();

        if (err) {
          console.error('Erro Supabase ao inserir:', err);
          throw new Error(err.message || 'Erro ao inserir registro');
        }
        
        if (!data) {
          throw new Error('Nenhum dado retornado do servidor');
        }

        console.log('Registro adicionado com sucesso:', data);
        return data;
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : 'Erro desconhecido ao adicionar registro';
        setError(mensagem);
        console.error('Erro ao adicionar registro:', err);
        return null;
      }
    },
    []
  );

  const concluirRegistro = useCallback(async (id: string, usuarioId: string): Promise<boolean> => {
    try {
      const registroAtual = registros.find((r) => r.id === id);
      if (!registroAtual) {
        console.error('Registro não encontrado no estado local:', id);
        throw new Error('Registro não encontrado');
      }

      // POKA-YOKE: Usar fuso horário de Brasília
      const agoraBrasilia = getDataHoraBrasilia();
      const tempoTotalSegundos = Math.floor(
        (new Date(agoraBrasilia).getTime() - new Date(registroAtual.criado_em).getTime()) / 1000
      );
      
      console.log('Iniciando atualização de conclusão (Brasília):', {
        id,
        usuarioId,
        tempoTotalSegundos,
      });

      // Campos básicos que temos certeza que existem
      const updateData: any = {
        status: 'concluido',
        concluido_em: agoraBrasilia,
        concluido_por: usuarioId,
        tempo_total_segundos: tempoTotalSegundos,
      };

      // Tentar atualizar
      const { error: err } = await supabase
        .from('registros_andon')
        .update(updateData)
        .eq('id', id);

      if (err) {
        console.error('Erro ao concluir no Supabase:', err);
        throw new Error(err.message || 'Erro ao atualizar banco de dados');
      }

      console.log('Registro concluído com sucesso no Supabase');
      
      // Atualizar estado local imediatamente para feedback instantâneo
      setRegistros(prev => prev.map(r => r.id === id ? { ...r, ...updateData } : r));
      
      return true;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao concluir registro';
      setError(mensagem);
      console.error('Erro na função concluirRegistro:', err);
      return false;
    }
  }, [registros]);

  return {
    registros,
    loading,
    error,
    adicionarRegistro,
    concluirRegistro,
    carregarRegistros,
  };
}
