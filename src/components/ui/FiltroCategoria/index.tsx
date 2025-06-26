// src/components/FiltroCategoria.tsx
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  onChange: (categoria: string | null) => void;
}

const categoriasFixas = [
  "Camisa",
  "Calça",
  "Vestido",
  "Sapato",
  "Acessório",
  "Outro",
];

export default function FiltroCategoria({ onChange }: Props) {
  const [categoria, setCategoria] = useState<string | null>(null);

  function handleSelect(value: string) {
    const novaCategoria = value === "todas" ? null : value;
    setCategoria(novaCategoria);
    onChange(novaCategoria);
  }

  return (
    <div className="mb-4">
      <Label className="text-sm text-zinc-600 mb-1 block">Filtrar por categoria:</Label>
      <Select onValueChange={handleSelect} >
        <SelectTrigger className="w-full max-w-xs !bg-white text-zinc-500 !border-2 !border-zinc-300">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {categoriasFixas.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
