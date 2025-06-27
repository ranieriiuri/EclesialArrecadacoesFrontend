import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVenda } from "@/hooks/useVenda";
import { Peca } from "@/types/Peca";
import { Evento } from "@/types/Evento";
import { eventoEstaEmAndamento } from "@/hooks/useEventos";

interface VendaModalProps {
  open: boolean;
  onClose: () => void;
  peca: Peca;
  evento: Evento;
}

export function VendaModal({ open, onClose, peca, evento }: VendaModalProps) {
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState(peca.preco);
  const [comprador, setComprador] = useState("");

  const { registrarVenda } = useVenda();
  const valorArrecadado = preco * quantidade;

  const isEventoValido = eventoEstaEmAndamento(evento);

  const handleIncrement = () => {
    if (quantidade < peca.quantidade) setQuantidade((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantidade > 1) setQuantidade((q) => q - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEventoValido) return;

    registrarVenda.mutate(
      {
        pecaId: peca.id,
        eventoId: evento.id,
        quantidadeVendida: quantidade,
        comprador: comprador.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setQuantidade(1);
          setPreco(peca.preco);
          setComprador("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white/90 backdrop-blur-sm shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Registrar venda</DialogTitle>
        </DialogHeader>

        {!isEventoValido && (
          <div className="text-red-600 font-semibold text-sm mb-2">
            Este evento não está em andamento. Inicie o evento para permitir vendas.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Nome da peça</Label>
            <Input value={peca.nome} disabled />
          </div>

          <div>
            <Label>Cor</Label>
            <Input value={peca.cor || "-"} disabled />
          </div>

          <div>
            <Label>Categoria</Label>
            <Input value={peca.categoria} disabled />
          </div>

          <div>
            <Label>Quantidade</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleDecrement}
                disabled={quantidade <= 1 || !isEventoValido}
              >
                -
              </Button>
              <span>{quantidade}</span>
              <Button
                type="button"
                onClick={handleIncrement}
                disabled={quantidade >= peca.quantidade || !isEventoValido}
              >
                +
              </Button>
            </div>
            <small className="text-muted">Disponível: {peca.quantidade}</small>
          </div>

          <div>
            <Label>Preço (R$)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              disabled={!isEventoValido}
            />
          </div>

          <div>
            <Label>Comprador (opcional)</Label>
            <Input
              type="text"
              value={comprador}
              onChange={(e) => setComprador(e.target.value)}
              placeholder="Nome do comprador"
              disabled={!isEventoValido}
            />
          </div>

          <div>
            <Label>Total arrecadado</Label>
            <Input value={`R$ ${valorArrecadado.toFixed(2)}`} disabled />
          </div>

          <Button type="submit" className="w-full" disabled={!isEventoValido}>
            Registrar venda
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
