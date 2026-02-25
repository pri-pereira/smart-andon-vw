import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
}

export function useAuthRE() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento de usuário
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole") as 'admin' | 'user' || 'user';
    
    if (authToken) {
      setUser({
        id: "1",
        email: "user@example.com",
        name: "Usuário",
        role: userRole,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulação de login
      // Se o email contiver "admin", definimos como admin para testes
      const role = email.includes('admin') ? 'admin' : 'user';
      localStorage.setItem("authToken", "dummy-token");
      localStorage.setItem("userRole", role);
      
      setUser({
        id: "1",
        email,
        name: "Usuário",
        role: role,
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
