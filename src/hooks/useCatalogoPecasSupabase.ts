import { useState, useEffect } from "react";

interface Peca {
  id: string;
  codigo: string;
  nome: string;
  celula: string;
}

export function useCatalogoPecasSupabase() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento de peças
    const pecasSimuladas: Peca[] = [
      {
        id: "1",
        codigo: "088",
        nome: "Vidro Lateral Polo",
        celula: "Célula Vidros",
      },
      {
        id: "2",
        codigo: "101",
        nome: "Para-brisa Taos",
        celula: "Célula Vidros",
      },
      {
        id: "3",
        codigo: "202",
        nome: "Vigia Traseiro T-Cross",
        celula: "Célula Vidros",
      },
      {
        id: "4",
        codigo: "303",
        nome: "Vidro Porta Dianteira",
        celula: "Célula Vidros",
      },
      {
        id: "5",
        codigo: "404",
        nome: "Kit Fixação Cola",
        celula: "Célula Vidros",
      },
    ];

    setPecas(pecasSimuladas);
    setLoading(false);
  }, []);

  const buscarPeca = (codigo: string): Peca | undefined => {
    return pecas.find((p) => p.codigo === codigo);
  };

  return { pecas, loading, error, buscarPeca };
}
