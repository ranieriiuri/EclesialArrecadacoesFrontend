// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { User } from "@/types/User";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/hooks/useRegister"; // tipo do formulário de registro

interface AuthContextData {
  token: string | null;
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (data: FormData) => Promise<boolean>; // <-- NOVO
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch {
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post("/auth/login", { email, senha });
      const { token, user } = data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      navigate("/dashboard");
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

  const register = async (data: FormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      navigate("/dashboard");
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao registrar usuário.");
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
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
