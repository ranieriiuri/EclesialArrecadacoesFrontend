import { useEffect, useState } from "react";
import api from "@/services/api";
import { User } from "@/types/User";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get<User>("/usuarios/me-completo");
        setUser(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar usuário:", err);
        setError("Não foi possível carregar os dados do usuário.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
