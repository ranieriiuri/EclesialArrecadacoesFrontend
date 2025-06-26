export interface Peca {
  id: string;
  nome: string;
  cor?: string;
  categoria: string;
  quantidade: number;
  preco: number;
  observacoes?: string;
  disponivel: boolean;
  criadoEm?: string;
}
