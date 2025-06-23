import { useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/auth/login", { email, senha });
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/dashboard"); // redireciona para rota protegida
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
