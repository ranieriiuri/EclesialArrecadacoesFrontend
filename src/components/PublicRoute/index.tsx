// src/components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

//Usando ReactElement para aceitar um só elemento react renderizado, para aceitar mais, usar 'ReactNodes'
export default function PublicRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();

  // Se já estiver autenticado, redireciona para o dashboard
  if (token) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
