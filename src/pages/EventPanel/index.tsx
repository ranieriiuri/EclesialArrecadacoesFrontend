import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Peca } from "@/types/Peca";
import { Evento } from "@/types/Evento";
import { VendaModal } from "@/components/ui/VendaModal";
import { ArrowLeft } from "lucide-react";
import { eventoEstaEmAndamento } from "@/hooks/useEventos";
import { useUser } from "@/hooks/useUser";
import UserGreeting from "@/components/ui/UserGreeting";

// ... (imports mantidos)

export default function EventPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUser();

  const [selectedPeca, setSelectedPeca] = useState<Peca | null>(null);

  const eventoQuery = useQuery<Evento>({
    queryKey: ["evento", id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
  });

  const pecasQuery = useQuery<Peca[]>({
    queryKey: ["pecas-disponiveis"],
    queryFn: async () => {
      const { data } = await api.get("/pecas/disponiveis");
      return data;
    },
  });

  const iniciarMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/events/${id}/starting`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento", id] });
    },
  });

  const finalizarMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/events/${id}/finishing`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento", id] });
      alert("Evento finalizado com sucesso! Você será redirecionado para o dashboard em 5 segundos.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    },
  });

  if (eventoQuery.isLoading) return <Skeleton className="h-10 w-32" />;
  if (eventoQuery.isError) return <p>Erro ao carregar evento.</p>;

  const evento = eventoQuery.data!;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      {/* Topo */}
      <div className="flex items-center justify-between mb-6 px-6 py-10">
        <button onClick={() => navigate(-1)} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
          <ArrowLeft />
        </button>
        {!isUserLoading && user && <UserGreeting user={user} />}
      </div>

      <h2 className="text-4xl font-bold text-center text-amber-600 mb-6">Painel do evento</h2>

      {/* Dados do Evento */}
      <div className="bg-slate-900 text-white shadow p-4 rounded-xl mb-6">
        <p><strong>Tipo:</strong> {evento.tipo}</p>
        <p><strong>Status:</strong> {evento.status}</p>
        <p><strong>Descrição:</strong> {evento.descricao || "Sem descrição"}</p>
        <p>
          <strong>Data início:</strong>{" "}
          {evento.dataInicio
            ? new Date(evento.dataInicio).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Não iniciada"}
        </p>
        <p>
          <strong>Data fim:</strong>{" "}
          {evento.dataFim
            ? new Date(evento.dataFim).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Não finalizada"}
        </p>
      </div>

      {/* Ações */}
      <div className="flex gap-4 mb-8 items-center justify-between">
        <Button
          onClick={() => iniciarMutation.mutate()}
          disabled={evento.status !== "planejando" || iniciarMutation.isPending}
          className="!bg-slate-700 text-white hover:text-amber-600"
        >
          {iniciarMutation.isPending ? "Iniciando..." : "Iniciar evento"}
        </Button>
        <Button
          onClick={() => finalizarMutation.mutate()}
          variant="destructive"
          disabled={
            evento.status !== "em andamento" || finalizarMutation.isPending
          }
          className="!bg-slate-700 text-white hover:text-amber-600"
        >
          {finalizarMutation.isPending ? "Finalizando..." : "Finalizar evento"}
        </Button>
      </div>

      {/* Listagem de Peças */}
      <h2 className="text-xl font-bold mb-4 text-slate-800">Peças disponíveis</h2>

      {pecasQuery.isLoading ? (
        <p>Carregando peças...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pecasQuery.data?.map((peca) => (
            <div
              key={peca.id}
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100 border border-slate-800 hover:bg-slate-600 hover:text-white transition-all cursor-pointer"
              onClick={() => {
                if (eventoEstaEmAndamento(evento)) {
                  setSelectedPeca(peca);
                } else {
                  alert("Este evento ainda não foi iniciado ou já foi finalizado. Inicie o evento para registrar vendas.");
                }
              }}
            >
              <p className="font-semibold">{peca.nome}</p>
              <p>Cor: {peca.cor || "-"}</p>
              <p>Categoria: {peca.categoria}</p>
              <p>Qtd: {peca.quantidade}</p>
              <p>Preço: R$ {peca.preco.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de venda */}
      {selectedPeca && (
        <VendaModal
          open={!!selectedPeca}
          onClose={() => {
            setSelectedPeca(null);
            queryClient.invalidateQueries({ queryKey: ["pecas-disponiveis"] });
          }}
          peca={selectedPeca}
          evento={evento}
        />
      )}
    </div>
  );
}
