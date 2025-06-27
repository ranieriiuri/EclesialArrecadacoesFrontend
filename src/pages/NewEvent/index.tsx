import { useState } from "react";
import { useEventos } from "@/hooks/useEventos";
import { TipoEvento } from "@/types/Evento";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Footer from "@/components/ui/Footer";
import UserGreeting from "@/components/ui/UserGreeting";

export default function NewEvent() {
  const { eventos, isLoading, error, criarEvento, excluirEvento } = useEventos();
  const { data: user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();

  const tiposPermitidos: TipoEvento[] = [
    "bazar",
    "cantina",
    "doacao",
    "venda externa",
  ];

  const [tipo, setTipo] = useState<TipoEvento>("bazar");
  const [descricao, setDescricao] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (tipo !== "bazar") {
      setFormError("Por enquanto, só é permitido criar eventos do tipo 'bazar'.");
      return;
    }

    setFormError(null);

    criarEvento.mutate(
      { tipo, descricao },
      {
        onSuccess: () => {
          setDescricao("");
          setTipo("bazar");
        },
      }
    );
  }

  if (isLoading) return <p>Carregando eventos...</p>;
  if (error) return <p>Erro ao carregar eventos.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <main className="flex-grow px-6 py-10 max-w-4xl mx-auto w-full">
        {/* Topo com botão voltar + saudação */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700 px-2 py-1 rounded"
          >
            <ArrowLeft />
          </button>
          {!isUserLoading && user && <UserGreeting user={user} />}
        </div>

        <h2 className="text-4xl font-bold text-center text-amber-600 mb-6">Criar novo evento</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-lg">
          <div>
            <Label htmlFor="tipo" className="p-2">Tipo do evento</Label>
            <Select
              value={tipo}
              onValueChange={(value) => setTipo(value as TipoEvento)}
              disabled
            >
              <SelectTrigger className="w-full !bg-zinc-300">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposPermitidos.map((t) => (
                  <SelectItem key={t} value={t} disabled={t !== "bazar"}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descricao" className="p-2">Descrição</Label>
            <Input
              id="descricao"
              type="text"
              placeholder="Descrição do evento (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {formError && <p className="text-red-600">{formError}</p>}

          <Button type="submit" disabled={criarEvento.isPending} className="!bg-slate-700 text-white hover:text-amber-600">
            {criarEvento.isPending ? "Criando..." : "Criar Evento"}
          </Button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Eventos atuais</h2>

        {eventos.length === 0 && <p className="text-zinc-400">Nenhum evento em planejamento ou em andamento.</p>}

        <div className="grid gap-4">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/events/${evento.id}`}
                  className="font-semibold text-amber-600 hover:underline block"
                  title="Clique para gerenciar o evento"
                >
                  {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                </Link>
                <p className="text-sm text-zinc-500">
                  {new Date(evento.criadoEm).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {evento.descricao && (
                  <p className="text-sm text-zinc-600 italic mt-1">{evento.descricao}</p>
                )}
                {evento.status && (
                  <p className="text-sm text-amber-600 italic mt-1">Status: {evento.status}</p>
                )}
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => excluirEvento.mutate(evento.id)}
                disabled={excluirEvento.isPending}
                className="!bg-slate-700 text-white hover:!bg-red-700"
              >
                {excluirEvento.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* Rodapé padrão */}
      <Footer />
    </div>
  );
}
