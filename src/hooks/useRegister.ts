import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export type FormData = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cargo?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  igreja: {
    nome: string;
    cnpj: string;
    cidade: string;
    estado: string;
  };
};

export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- integração com AuthContext
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const registerUser = async (data: FormData) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;
      login(token, user); // <-- salva no contexto global
      navigate("/dashboard");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, erro };
}
