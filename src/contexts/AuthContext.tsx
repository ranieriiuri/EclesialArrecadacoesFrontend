// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import Loading from "@/components/ui/Loading";

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (err) {
          console.error("Erro ao recuperar usuário:", err);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeUser();
  }, [token]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/auth/login", { email, senha });
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const me = await api.get("/auth/me");
      setUser(me.data);

      return true;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  // **Aqui: se estiver carregando, retorna o Loading**
  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
