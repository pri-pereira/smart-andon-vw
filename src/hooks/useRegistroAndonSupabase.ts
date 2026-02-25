/**
 * Hook: useRegistroAndonSupabase
 * 
 * Gerencia registros de andon com Supabase Realtime
 * Sincronização automática com banco de dados PostgreSQL
 * Inclui rastreabilidade de conclusão e tempo total
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase, type RegistroAndonDB } from '@/lib/supabase';

interface UseRegistroAndonReturn {
  registros: RegistroAndonDB[];
  loading: boolean;
  error: string | null;
  adicionarRegistro: (registro: Omit<RegistroAndonDB, 'id' | 'criado_em' | 'horario'>) => Promise<RegistroAndonDB | null>;
  concluirRegistro: (id: string, usuarioId: string) => Promise<boolean>;
  marcarComoEntregue: (id: string, usuarioId: string) => Promise<boolean>;
  carregarRegistros: () => Promise<void>;
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
        // Usamos o tempo do cliente (ISO) que o Supabase converterá para UTC no banco.
        // O importante é que o cliente envie o momento exato.
        const agora = new Date().toISOString();

        console.log('Enviando registro para Supabase:', {
          ...registro,
          horario: agora,
          criado_em: agora,
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
              horario: agora,
              criado_em: agora,
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

  const marcarComoEntregue = useCallback(async (id: string, usuarioId: string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('registros_andon')
        .update({ status: 'entregue' })
        .eq('id', id);

      if (err) throw err;
      return true;
    } catch (err) {
      console.error('Erro ao sinalizar entrega:', err);
      return false;
    }
  }, []);

  const concluirRegistro = useCallback(async (id: string, usuarioId: string): Promise<boolean> => {
    try {
      const registroAtual = registros.find((r) => r.id === id);
      if (!registroAtual) throw new Error('Registro não encontrado');

      const agora = new Date();
      const tempoTotalSegundos = Math.floor(
        (agora.getTime() - new Date(registroAtual.criado_em).getTime()) / 1000
      );

      const updateData: any = {
        status: 'concluido',
        concluido_em: agora.toISOString(),
        concluido_por: usuarioId,
        tempo_total_segundos: tempoTotalSegundos,
      };

      const { error: err } = await supabase
        .from('registros_andon')
        .update(updateData)
        .eq('id', id);

      if (err) throw new Error(err.message);

      setRegistros(prev => prev.map(r => r.id === id ? { ...r, ...updateData } : r));
      return true;
    } catch (err) {
      console.error('Erro ao concluir:', err);
      return false;
    }
  }, [registros]);

  return {
    registros,
    loading,
    error,
    adicionarRegistro,
    marcarComoEntregue,
    concluirRegistro,
    carregarRegistros,
  };
}
