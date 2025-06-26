// src/hooks/usePecas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Peca, NovaPecaComRegistroDoacaoRequest } from "@/types/Peca";

export function usePecas(categoria?: string | null) {
  const queryClient = useQueryClient();

  // 🔍 Listar todas as peças (opcionalmente filtrando por categoria)
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

  // ➕ Cadastrar nova peça (com doador e doação)
  const cadastrar = useMutation({
    mutationFn: async (nova: NovaPecaComRegistroDoacaoRequest) => {
      const { data } = await api.post("/pecas-com-doacao", nova);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] });
    },
  });

  // ✏️ Atualizar dados de peça
  const atualizar = useMutation({
    mutationFn: async (peca: Peca) => {
      const { data } = await api.put(`/pecas/${peca.id}`, peca);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas"] });
    },
  });

  // 🗑️ Excluir peça
  const excluir = useMutation({
    mutationFn: async (id: number) => {
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
