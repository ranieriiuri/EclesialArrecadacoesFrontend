// src/hooks/useRegister.ts
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/services/api";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // 🔁 renomeado para clareza

  const registerUser = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error }; // 🔁 'error' em vez de 'erro'
}
