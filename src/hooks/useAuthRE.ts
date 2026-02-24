import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuthRE() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento de usuário
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setUser({
        id: "1",
        email: "user@example.com",
        name: "Usuário",
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulação de login
      localStorage.setItem("authToken", "dummy-token");
      setUser({
        id: "1",
        email,
        name: "Usuário",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return { user, loading, error, login, logout };
}
