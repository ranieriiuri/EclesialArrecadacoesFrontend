import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Evento } from "@/types/Evento";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export default function EventHistory() {
  const navigate = useNavigate();

  const { data: eventos, isLoading } = useQuery<Evento[]>({
    queryKey: ["eventos-finalizados"],
    queryFn: async () => {
      const { data } = await api.get("/events?status=finalizado");
      return data;
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-800 mb-8">Eventos Anteriores</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {eventos?.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition border border-transparent hover:border-zinc-200 cursor-pointer"
              onClick={() => navigate(`/events/history/${evento.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-zinc-800">
                  {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                </h2>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-600 italic mb-1">
                {evento.descricao || "Sem descrição"}
              </p>
              <p className="text-xs text-zinc-500">
                {evento.dataInicio} — {evento.dataFim}
              </p>
              {evento.criadoPor?.nome && (
                <p className="text-xs text-zinc-500">Criado por: {evento.criadoPor.nome}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
