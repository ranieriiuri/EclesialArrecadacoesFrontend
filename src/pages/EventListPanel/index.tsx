import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Evento } from "@/types/Evento";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function EventListPanel() {
  const navigate = useNavigate();

  const { data: eventos, isLoading } = useQuery<Evento[]>({
    queryKey: ["eventos-planejando"],
    queryFn: async () => {
      const { data } = await api.get("/events?status=planejando");
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
        <div className="flex items-center justify-between mb-6 px-6 py-10">
            <button onClick={() => navigate(-1)} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
             <ArrowLeft />
            </button>
        </div>
        <h2 className="text-4xl font-bold text-amber-600 p-4">Eventos ativos</h2>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
          {eventos?.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition border border-slate-700 hover:border-zinc-200 hover:bg-slate-600 cursor-pointer "
              onClick={() => navigate(`/events/${evento.id}`)}
              title="Clique para gerenciar o evento"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-zinc-800 ">
                  {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                </h2>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-600 italic mb-1 hover:text-white">
                {evento.descricao || "Sem descrição"}
              </p>
              {evento.status && (
                <p className="text-xs text-amber-600">
                Status: {evento.status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mb-8 p-6">
            <Button onClick={() => navigate("/events/new")} className="!bg-slate-700 text-white hover:text-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
            </Button>
        </div>
    </div>
  );
}
