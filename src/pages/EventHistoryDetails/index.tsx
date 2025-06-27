import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Evento } from "@/types/Evento";
import { VendaResumo } from "@/types/VendaResumo";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventHistoryDetails() {
  const { id } = useParams();
  const reportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (!id) {
    return (
      <p className="text-red-600 text-center mt-10">
        ID do evento não encontrado na URL.
      </p>
    );
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

  const handleDownloadReport = async () => {
    try {
      const response = await api.get(`/events/${id}/report`, {
        responseType: "blob", // ⚠️ necessário para arquivos binários
      });
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-evento-${id}.pdf`;
      a.click();
  
      window.URL.revokeObjectURL(url); // Limpa memória
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      alert("Erro ao baixar o relatório. Tente novamente.");
    }
  };
  

  if (loadingEvento || loadingVendas) {
    return <Skeleton className="h-10 w-32" />;
  }

  return (
    <div
      ref={reportRef}
      className="min-h-screen flex flex-col bg-zinc-100 max-w-5xl mx-auto px-6 py-10 rounded-xl shadow"
    >
<div className="flex items-center justify-between mb-6 px-6 py-10">
            <button onClick={() => navigate(-1)} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
             <ArrowLeft />
            </button>
        </div>

      <h2 className="text-4xl font-bold text-center text-amber-600 mb-8 p-6">
        Relatório do Evento: {evento?.descricao || evento?.tipo}
      </h2>

      <div className="bg-slate-900 text-white shadow p-6 mb-8 rounded-xl space-y-2">
        <p>
          <strong>Tipo:</strong> {evento?.tipo}
        </p>
        <p>
          <strong>Data início:</strong> {formatDateTime(evento?.dataInicio)}
        </p>
        <p>
          <strong>Data fim:</strong> {formatDateTime(evento?.dataFim)}
        </p>
        <p>
          <strong>Total de Vendas:</strong> {vendas?.length}
        </p>
        <p>
          <strong>Valor Total:</strong> R${" "}
          {vendas?.reduce((acc, v) => acc + v.valorArrecadado, 0).toFixed(2)}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-slate-800">Vendas registradas</h2>

      <div className="space-y-3 mb-10">
        {vendas?.map((venda) => (
          <div
            key={venda.id}
            className="bg-white p-4 rounded-xl shadow border text-sm text-zinc-700"
          >
            <p>
              <strong>Peça:</strong> {venda.pecaNome}
            </p>
            <p>
              <strong>Comprador:</strong> {venda.comprador || "Anônimo"}
            </p>
            <p>
              <strong>Qtd:</strong> {venda.quantidade}
            </p>
            <p>
              <strong>Total venda:</strong> R$ {venda.valorArrecadado.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
  <button
    onClick={handleDownloadReport}
    className="!bg-slate-700 hover:text-amber-600 text-white font-semibold py-3 px-8 rounded shadow transition"
  >
    Baixar relatório em PDF
  </button>
</div>

    </div>
  );
}
