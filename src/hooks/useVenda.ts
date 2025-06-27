// src/hooks/useVendas.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { VendaResumo } from "@/types/VendaResumo";
import { VendaRequest } from "@/types/VendaRequest";

export function useVenda() {
  const queryClient = useQueryClient();

  // 🔹 Buscar todas as vendas
  const vendasQuery = useQuery<VendaResumo[], Error>({
    queryKey: ["vendas"],
    queryFn: async () => {
      const { data } = await api.get<VendaResumo[]>("/sales");
      return data;
    },
  });

  // 🔹 Registrar nova venda
  const registrarVenda = useMutation<void, Error, VendaRequest>({
    mutationFn: async (novaVenda) => {
      await api.post("/sales/new", novaVenda);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
    },
  });

  return {
    vendas: vendasQuery.data ?? [],
    isLoading: vendasQuery.isLoading,
    error: vendasQuery.error,
    registrarVenda,
  };
}
