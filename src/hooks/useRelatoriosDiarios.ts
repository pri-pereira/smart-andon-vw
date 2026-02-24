import { useState, useEffect } from "react";

interface Relatorio {
  id: string;
  data: string;
  total: number;
  concluidos: number;
  pendentes: number;
}

export function useRelatoriosDiarios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento de relatórios
    const relatoriosSimulados: Relatorio[] = [
      {
        id: "1",
        data: new Date().toISOString().split("T")[0],
        total: 25,
        concluidos: 20,
        pendentes: 5,
      },
    ];

    setRelatorios(relatoriosSimulados);
    setLoading(false);
  }, []);

  return { relatorios, loading, error };
}
