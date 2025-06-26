import { useState } from "react";
import { usePecas } from "@/hooks/usePecas";
import PecaCard from "@/components/PecaCard";
import PecaFormModal from "@/components/PecaFormModal";
import FiltroCategoria from "@/components/FiltroCategoria";
import { Button } from "@/components/ui/button";

export default function Inventory() {
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const { pecas, isLoading } = usePecas(categoriaSelecionada);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-800">Estoque de Peças</h1>
        <Button onClick={() => setModalAberto(true)}>Cadastrar Peça</Button>
      </div>

      <FiltroCategoria onChange={setCategoriaSelecionada} />

      {isLoading ? (
        <p className="text-center text-sm text-zinc-500 mt-10">Carregando peças...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {pecas.map((peca) => (
            <PecaCard key={peca.id} peca={peca} />
          ))}
        </div>
      )}

      <PecaFormModal aberto={modalAberto} onClose={() => setModalAberto(false)} />
    </div>
  );
}
