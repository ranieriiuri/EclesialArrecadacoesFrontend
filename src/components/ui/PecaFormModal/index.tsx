// src/components/PecaFormModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePecas } from "@/hooks/usePecas";
import { Peca, NovaPecaComRegistroDoacaoRequest } from "@/types/Peca";

interface Props {
  aberto: boolean;
  onClose: () => void;
  pecaExistente?: Peca | null;
}

export default function PecaFormModal({ aberto, onClose, pecaExistente }: Props) {
  const { cadastrar, atualizar } = usePecas();

  const [form, setForm] = useState<NovaPecaComRegistroDoacaoRequest>({
    nome: "",
    categoria: "",
    tamanho: "",
    doador: {
      nome: "",
      email: "",
      telefone: "",
    },
  });

  useEffect(() => {
    if (pecaExistente) {
      setForm({
        nome: pecaExistente.nome,
        categoria: pecaExistente.categoria,
        tamanho: pecaExistente.tamanho ?? "",
        doador: {
          nome: pecaExistente.doador?.nome ?? "",
          email: "",
          telefone: "",
        },
      });
    } else {
      setForm({
        nome: "",
        categoria: "",
        tamanho: "",
        doador: {
          nome: "",
          email: "",
          telefone: "",
        },
      });
    }
  }, [pecaExistente]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name.startsWith("doador.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        doador: {
          ...prev.doador,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (pecaExistente) {
      atualizar.mutate(
        {
          ...pecaExistente,
          nome: form.nome,
          categoria: form.categoria,
          tamanho: form.tamanho,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      cadastrar.mutate(form, {
        onSuccess: () => onClose(),
      });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {pecaExistente ? "Editar Peça" : "Cadastrar Nova Peça"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            name="nome"
            placeholder="Nome da peça"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <Input
            name="categoria"
            placeholder="Categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          />
          <Input
            name="tamanho"
            placeholder="Tamanho (opcional)"
            value={form.tamanho}
            onChange={handleChange}
          />

          {!pecaExistente && (
            <>
              <Input
                name="doador.nome"
                placeholder="Nome do doador"
                value={form.doador.nome}
                onChange={handleChange}
                required
              />
              <Input
                name="doador.email"
                placeholder="Email do doador (opcional)"
                value={form.doador.email}
                onChange={handleChange}
              />
              <Input
                name="doador.telefone"
                placeholder="Telefone do doador (opcional)"
                value={form.doador.telefone}
                onChange={handleChange}
              />
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cadastrar.isPending || atualizar.isPending}>
              {pecaExistente ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
