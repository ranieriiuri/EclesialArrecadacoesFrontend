import { useState } from "react";
import api from "@/services/api";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/auth/login", { email, senha });
      const { token } = response.data;

      localStorage.setItem("token", token);
      return true; // ✅ login bem-sucedido
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais."
      );
      return false; // ❌ login falhou
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
