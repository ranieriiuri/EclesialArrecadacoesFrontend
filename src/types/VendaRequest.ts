export interface VendaRequest {
  pecaId: string;
  eventoId: string;
  quantidadeVendida: number;
  comprador?: string;
}