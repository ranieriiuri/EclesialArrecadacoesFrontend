// src/components/PecaFormModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePecas } from "@/hooks/usePeca"; // corrigido nome do hook
import { Peca } from "@/types/Peca";
import { NovaPecaComRegistroDoacaoRequest } from "@/types/NovaPecaComRegistroDoacaoRequest";

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
    cor: "",
    quantidade: 1,
    preco: 0,
    observacoes: "",
    nomeDoador: "",
    contato: "",
    observacoesDoador: "",
  });

  useEffect(() => {
    if (pecaExistente) {
      setForm({
        nome: pecaExistente.nome,
        categoria: pecaExistente.categoria,
        cor: pecaExistente.cor || "",
        quantidade: pecaExistente.quantidade,
        preco: pecaExistente.preco,
        observacoes: pecaExistente.observacoes || "",
      });
    } else {
      setForm({
        nome: "",
        categoria: "",
        cor: "",
        quantidade: 1,
        preco: 0,
        observacoes: "",
        nomeDoador: "",
        contato: "",
        observacoesDoador: "",
      });
    }
  }, [pecaExistente]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantidade" || name === "preco" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (pecaExistente) {
      atualizar.mutate(
        {
          ...pecaExistente,
          nome: form.nome,
          categoria: form.categoria,
          cor: form.cor,
          quantidade: form.quantidade,
          preco: form.preco,
          observacoes: form.observacoes,
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
          <Input name="nome" placeholder="Nome da peça" value={form.nome} onChange={handleChange} required />
          <Input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} required />
          <Input name="cor" placeholder="Cor (opcional)" value={form.cor} onChange={handleChange} />
          <Input name="quantidade" type="number" placeholder="Quantidade" value={form.quantidade} onChange={handleChange} required />
          <Input name="preco" type="number" step="0.01" placeholder="Preço (R$)" value={form.preco} onChange={handleChange} required />
          <Input name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} />

          {!pecaExistente && (
            <>
              <Input name="nomeDoador" placeholder="Nome do doador" value={form.nomeDoador} onChange={handleChange} required />
              <Input name="contato" placeholder="Contato (telefone ou email)" value={form.contato} onChange={handleChange} />
              <Input name="observacoesDoador" placeholder="Observações sobre o doador" value={form.observacoesDoador} onChange={handleChange} />
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={cadastrar.isPending || atualizar.isPending}>
              {pecaExistente ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
