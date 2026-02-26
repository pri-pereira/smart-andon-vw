/**
 * Utilitários de Tempo para o Smart Andon - Volkswagen Taubaté
 * 
 * Garante que todas as operações de data e hora utilizem o fuso horário
 * de Brasília (UTC-3) e formatações industriais (HH:MM:SS).
 */

/**
 * Retorna a data/hora atual ajustada para o fuso horário de Brasília (UTC-3).
 */
export const getAgoraBrasilia = (): Date => {
  return new Date();
};

/**
 * Converte uma data para o fuso horário de Brasília (America/Sao_Paulo)
 * e retorna apenas a parte da data no formato YYYY-MM-DD.
 * Útil para comparar "hoje" ou filtrar por data.
 */
export const getDataISObrasilia = (date: Date | string = new Date()): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Usamos Intl.DateTimeFormat para obter a data correta no fuso de Brasília
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d);
};

/**
 * Retorna a data de hoje em Brasília no formato YYYY-MM-DD
 */
export const getHojeBrasilia = (): string => {
  return getDataISObrasilia(new Date());
};

/**
 * Formata segundos em MM:SS (conforme solicitado para a barra de progresso)
 */
export const formatarSegundosMMSS = (totalSegundos: number): string => {
  if (isNaN(totalSegundos) || totalSegundos < 0) return "00:00";
  
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = Math.floor(totalSegundos % 60);

  const mDisplay = minutos.toString().padStart(2, '0');
  const sDisplay = segundos.toString().padStart(2, '0');

  return `${mDisplay}:${sDisplay}`;
};

/**
 * Formata segundos em HH:MM:SS
 */
export const formatarSegundos = (totalSegundos: number): string => {
  if (isNaN(totalSegundos) || totalSegundos < 0) return "00:00:00";
  
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = Math.floor(totalSegundos % 60);

  const hDisplay = horas.toString().padStart(2, '0');
  const mDisplay = minutos.toString().padStart(2, '0');
  const sDisplay = segundos.toString().padStart(2, '0');

  return `${hDisplay}:${mDisplay}:${sDisplay}`;
};

/**
 * Formata uma string de data (ISO) para o horário local (HH:MM:SS) no fuso de Brasília
 */
export const formatarHorarioLocal = (dateString: string): string => {
  if (!dateString) return "--:--:--";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (e) {
    return "--:--:--";
  }
};

/**
 * Formata uma string de data (ISO) para a data local (DD/MM/YYYY) no fuso de Brasília
 */
export const formatarDataLocal = (dateString: string): string => {
  if (!dateString) return "--/--/----";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  } catch (e) {
    return "--/--/----";
  }
};

/**
 * Compara se duas datas são o mesmo dia no fuso de Brasília
 * Ignora as horas - compara apenas dia/mês/ano
 */
export const isMesmoDia = (date1: Date | string, date2: Date | string): boolean => {
  const d1ISO = getDataISObrasilia(date1);
  const d2ISO = getDataISObrasilia(date2);
  return d1ISO === d2ISO;
};
