import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Evento } from "@/types/Evento";
import { VendaResumo } from "@/types/VendaResumo";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventHistoryDetails() {
  const { id } = useParams();

  if (!id) {
    return <p className="text-red-600 text-center mt-10">ID do evento não encontrado na URL.</p>;
  }

  const { data: evento, isLoading: loadingEvento } = useQuery<Evento>({
    queryKey: ["evento", id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
  });

  const { data: vendas, isLoading: loadingVendas } = useQuery<VendaResumo[]>({
    queryKey: ["vendas", id],
    queryFn: async () => {
      const { data } = await api.get(`/sales/event/${id}`);
      return data;
    },
  });

  if (loadingEvento || loadingVendas) {
    return <Skeleton className="h-10 w-32" />;
  }

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "Não informada";
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">
        Relatório do Evento: {evento?.descricao || evento?.tipo}
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8 space-y-2 text-zinc-700">
        <p><strong>Tipo:</strong> {evento?.tipo}</p>
        <p><strong>Data início:</strong> {formatDateTime(evento?.dataInicio)}</p>
        <p><strong>Data fim:</strong> {formatDateTime(evento?.dataFim)}</p>
        <p><strong>Total de Vendas:</strong> {vendas?.length}</p>
        <p>
          <strong>Valor Total:</strong> R${" "}
          {vendas?.reduce((acc, v) => acc + v.valorArrecadado, 0).toFixed(2)}
        </p>
      </div>

      <h2 className="text-lg font-semibold text-zinc-800 mb-4">Vendas registradas</h2>

      <div className="space-y-3">
        {vendas?.map((venda) => (
          <div
            key={venda.id}
            className="bg-white p-4 rounded-xl shadow border text-sm text-zinc-700"
          >
            <p><strong>Peça:</strong> {venda.pecaNome}</p>
            <p><strong>Comprador:</strong> {venda.comprador || "Anônimo"}</p>
            <p><strong>Qtd:</strong> {venda.quantidade}</p>
            <p><strong>Total venda:</strong> R$ {venda.valorArrecadado.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
