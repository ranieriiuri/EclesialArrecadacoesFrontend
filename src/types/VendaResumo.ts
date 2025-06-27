export interface VendaResumo {
  id: string;
  pecaNome: string;
  eventoId: string;  // UUID do evento
  comprador?: string | null;
  quantidade: number;
  valorArrecadado: number; // Pode ser decimal, depende de como você trata no frontend
  dataVenda: string; // ISO string
}