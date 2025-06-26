// src/components/PecaCard.tsx
import { Peca } from "@/types/Peca";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

interface PecaCardProps {
  peca: Peca;
  onEditar?: (peca: Peca) => void;
  onExcluir?: (id: string) => void;
}

export default function PecaCard({ peca, onEditar, onExcluir }: PecaCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-zinc-800">{peca.nome}</h2>
        <p className="text-sm text-zinc-500">Categoria: {peca.categoria}</p>

        {peca.cor && (
          <p className="text-sm text-zinc-500">Cor: {peca.cor}</p>
        )}

        <p className="text-sm text-zinc-500">
          Quantidade: {peca.quantidade} | Preço: R$ {peca.preco.toFixed(2)}
        </p>

        {peca.observacoes && (
          <p className="text-sm text-zinc-400 mt-1">Obs: {peca.observacoes}</p>
        )}
      </div>

      <div className="flex gap-2 pl-2 text-white ">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEditar?.(peca)}
          className="!bg-slate-700"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onExcluir?.(peca.id)}
          className="!bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
