import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { RankingDoador } from "@/types/RankingDoador";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DonorsRanking() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery<RankingDoador[]>({
    queryKey: ["donorsRanking", inicio, fim],
    queryFn: async () => {
      if (!inicio || !fim) return [];
      const { data } = await api.get("/donations/donors/ranking/range", {
        params: { inicio, fim },
      });
      return data;
    },
    enabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inicio || !fim) {
      alert("Por favor, preencha as datas de início e fim.");
      return;
    }
    setBuscaAtiva(true);
    refetch();
  };

  // Ordena os dados antes de mostrar (decrescente por totalDoacoes)
  const dataOrdenada = data ? [...data].sort((a, b) => b.totalDoacoes - a.totalDoacoes) : [];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6 px-6 py-6">
            <button onClick={() => navigate(-1)} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
             <ArrowLeft />
            </button>
        </div>

      <h2 className="text-4xl text-amber-600 font-bold mb-6 text-center">Ranking Doadores</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
      >
        <div className="flex flex-col">
          <label htmlFor="inicio" className="mb-1 font-semibold">
            Data Início:
          </label>
          <input
            id="inicio"
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fim" className="mb-1 font-semibold">
            Data Fim:
          </label>
          <input
            id="fim"
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="!bg-slate-700 hover:text-amber-600 text-white font-semibold px-6 py-3 rounded shadow transition"
        >
          Buscar
        </button>
      </form>

      {isLoading && <p className="text-center">Carregando ranking...</p>}

      {error && <p className="text-center text-red-600">Erro ao buscar ranking.</p>}

      {buscaAtiva && data && data.length === 0 && (
        <p className="text-center">Nenhum doador encontrado nesse período.</p>
      )}

      {dataOrdenada && dataOrdenada.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-slate-400 text-slate-800">
              <th className="border border-gray-300 px-4 py-2">Posição</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nome do Doador</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Total Doações</th>
            </tr>
          </thead>
          <tbody>
            {dataOrdenada.map((doador, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{doador.nome}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{doador.totalDoacoes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
