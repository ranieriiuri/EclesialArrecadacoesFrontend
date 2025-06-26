export interface NovaPecaComRegistroDoacaoRequest {
  nome: string;
  cor?: string;
  categoria: string;
  quantidade: number;
  preco: number;
  observacoes?: string;
  doadorId?: string;
  nomeDoador?: string;
  contato?: string;
  observacoesDoador?: string;
}
