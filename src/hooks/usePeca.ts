import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import { Peca } from "@/types/Peca";
import { NovaPecaComRegistroDoacaoRequest } from "@/types/NovaPecaComRegistroDoacaoRequest";
import { Doacao } from "@/types/Doacao";

export function usePecas(categoria?: string | null) {
  const { data = [], isLoading, refetch } = useQuery<Peca[]>({
    queryKey: ["pecas", categoria],
    queryFn: async () => {
      const endpoint = categoria ? `/pecas/categoria?categoria=${encodeURIComponent(categoria)}` : "/pecas";
      const { data } = await api.get(endpoint);
      return data;
    },
  });  

  const cadastrar = useMutation({
    mutationFn: async (nova: NovaPecaComRegistroDoacaoRequest) => {
      const { data } = await api.post<Doacao>("/pecas/pecas-com-doacao", nova);
      return data;
    },
  });

  const atualizar = useMutation({
    mutationFn: async (peca: Peca) => {
      const { data } = await api.put(`/pecas/${peca.id}`, peca);
      return data;
    },
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pecas/${id}`);
    },
  });

  return {
    pecas: data,
    isLoading,
    cadastrar,
    atualizar,
    excluir,
    refetch, // <- ADICIONE ISSO
  };
}
