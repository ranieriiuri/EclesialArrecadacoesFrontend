import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePecas } from "@/hooks/usePeca";
import { Peca } from "@/types/Peca";
import { NovaPecaComRegistroDoacaoRequest } from "@/types/NovaPecaComRegistroDoacaoRequest";
import { CATEGORIAS_FIXAS } from "@/consts/categorias";
import { X } from "lucide-react";


interface Props {
  aberto: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pecaExistente?: Peca;
}

type Errors = Partial<Record<keyof NovaPecaComRegistroDoacaoRequest, string>>;

export default function PecaFormModal({ aberto, onClose, onSuccess, pecaExistente }: Props) {
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

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (pecaExistente) {
      setForm({
        nome: pecaExistente.nome,
        categoria: pecaExistente.categoria,
        cor: pecaExistente.cor || "",
        quantidade: pecaExistente.quantidade,
        preco: pecaExistente.preco,
        observacoes: pecaExistente.observacoes || "",
        nomeDoador: "",
        contato: "",
        observacoesDoador: "",
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
    setErrors({});
  }, [pecaExistente]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantidade" || name === "preco" ? Number(value) : value,
    }));
  
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validar(): boolean {
    const newErrors: Errors = {};

    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório.";
    if (!form.categoria.trim()) newErrors.categoria = "Categoria é obrigatória.";
    if (form.quantidade <= 0) newErrors.quantidade = "Quantidade deve ser maior que zero.";
    if (form.preco < 0) newErrors.preco = "Preço não pode ser negativo.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validar()) return; // bloqueia envio se tiver erros

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
          onSuccess: () => {
            onClose();
            onSuccess?.();
          },
        }
      );
    } else {
      cadastrar.mutate(form, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        },
      });
    }
  }

  // Componente para mostrar erro abaixo do input
  function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-red-600 mt-1">{message}</p>;
  }

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white/90 backdrop-blur-sm shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {pecaExistente ? "Editar Peça" : "Cadastrar Nova Peça"}
          </DialogTitle>
          <DialogDescription>
             Preencha os campos abaixo para {pecaExistente ? "editar a peça" : "cadastrar uma nova"} no estoque.
          </DialogDescription>
          {/* Botão de fechar personalizado */}
          <DialogClose asChild>
            <button
                type="button"
                className="absolute top-4 right-4 rounded-full p-1 !text-white !hover:text-red-600 hover:bg-red-100"
                aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogClose>
      </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              name="nome"
              placeholder="Nome da peça"
              value={form.nome}
              onChange={handleChange}
              required
              aria-invalid={!!errors.nome}
            />
            <ErrorMessage message={errors.nome} />
          </div>

          <div>
          <select
    name="categoria"
    value={form.categoria}
    onChange={handleChange}
    required
    aria-invalid={!!errors.categoria}
    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Selecione uma categoria</option>
    {CATEGORIAS_FIXAS.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
            <ErrorMessage message={errors.categoria} />
          </div>

          <div>
            <Input
              name="cor"
              placeholder="Cor (opcional)"
              value={form.cor}
              onChange={handleChange}
            />
          </div>

          <div>
            <Input
              name="quantidade"
              type="number"
              placeholder="Quantidade"
              value={form.quantidade}
              onChange={handleChange}
              required
              min={1}
              aria-invalid={!!errors.quantidade}
            />
            <ErrorMessage message={errors.quantidade} />
          </div>

          <div>
            <Input
              name="preco"
              type="number"
              step="0.01"
              placeholder="Preço (R$)"
              value={form.preco}
              onChange={handleChange}
              required
              min={0}
              aria-invalid={!!errors.preco}
            />
            <ErrorMessage message={errors.preco} />
          </div>

          {!pecaExistente && (
            <>
              <div>
                <Input
                  name="nomeDoador"
                  placeholder="Nome do doador"
                  value={form.nomeDoador}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.nomeDoador}
                />
                <ErrorMessage message={errors.nomeDoador} />
              </div>

              <div>
                <Input
                  name="contato"
                  placeholder="Contato (telefone ou email)"
                  value={form.contato}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Input
                  name="observacoesDoador"
                  placeholder="Observações sobre o doador"
                  value={form.observacoesDoador}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="!bg-slate-700 text-white hover:text-amber-600">
              Cancelar
            </Button>
            <Button type="submit" disabled={cadastrar.isPending || atualizar.isPending} className="!bg-slate-700 text-white hover:text-amber-600">
              {pecaExistente ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
