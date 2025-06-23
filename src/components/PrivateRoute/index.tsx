// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

export default function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();

  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>; // ou return children diretamente se for seguro
}
