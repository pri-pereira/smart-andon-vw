import { ReactNode } from "react";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  // Verificar se o usuário está autenticado
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (adminOnly && userRole !== 'admin') {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
