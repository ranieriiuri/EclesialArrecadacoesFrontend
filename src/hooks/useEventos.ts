import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Evento } from "@/types/Evento";

// Função utilitária para checar se o evento está em andamento
export function eventoEstaEmAndamento(evento?: Evento): boolean {
  return !!evento?.dataInicio && !evento?.dataFim;
}

export function useEventos() {
  const queryClient = useQueryClient();

  const eventosQuery = useQuery<Evento[], Error>({
    queryKey: ["eventos"],
    queryFn: async () => {
      const { data } = await api.get<Evento[]>("/events");
      // Retorna apenas os eventos com status relevantes para o painel
      return data.filter(
        (e) => e.status === "planejando" || e.status === "em andamento"
      );
    },
  });

  const criarEvento = useMutation<
    Evento,
    Error,
    Omit<Evento, "id" | "criadoPor" | "criadoEm" | "status" | "dataInicio" | "dataFim">
  >({
    mutationFn: async (evento) => {
      const { data } = await api.post<Evento>("/events/new", evento);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
    },
  });

  const excluirEvento = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
    },
  });

  return {
    eventos: eventosQuery.data ?? [],
    isLoading: eventosQuery.isLoading,
    error: eventosQuery.error,
    criarEvento,
    excluirEvento,
  };
}
