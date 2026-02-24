import { ReactNode } from "react";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verificar se o usuário está autenticado (você pode usar seu contexto de autenticação aqui)
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
