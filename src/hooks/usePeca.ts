// src/hooks/usePecas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

import { Peca } from "@/types/Peca";
import { Doacao } from "@/types/Doacao";
import { NovaPecaComRegistroDoacaoRequest } from "@/types/NovaPecaComRegistroDoacaoRequest";

export function usePecas(categoria?: string | null) {
  const queryClient = useQueryClient();

  // 🔍 Listar todas as peças (com filtro por categoria, se houver)
  const { data: pecas = [], isLoading } = useQuery<Peca[]>({
    queryKey: ["pecas", categoria],
    queryFn: async () => {
      const endpoint = categoria
        ? `/pecas?categoria=${encodeURIComponent(categoria)}`
        : "/pecas";
      const { data } = await api.get(endpoint);
      return data;
    },
  });

  // ➕ Cadastrar nova peça com doador e doação
  const cadastrar = useMutation<Doacao, unknown, NovaPecaComRegistroDoacaoRequest>({
    mutationFn: async (nova) => {
      const { data } = await api.post("/pecas-com-doacao", nova);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] });
    },
  });

  // ✏️ Atualizar apenas os dados da peça
  const atualizar = useMutation<Peca, unknown, Peca>({
    mutationFn: async (peca) => {
      const { data } = await api.put(`/pecas/${peca.id}`, peca);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] });
    },
  });

  // 🗑️ Excluir peça por ID
  const excluir = useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await api.delete(`/pecas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] });
    },
  });

  return {
    pecas,
    isLoading,
    cadastrar,
    atualizar,
    excluir,
  };
}
