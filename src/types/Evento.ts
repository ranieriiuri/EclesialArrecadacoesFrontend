export type TipoEvento = "bazar" | "cantina" | "doacao" | "venda externa";

export type StatusEvento = "planejando" | "em andamento" | "finalizado";

export interface Evento {
  id: string;
  tipo: TipoEvento;
  descricao?: string;
  dataInicio?: string; // ISO string
  dataFim?: string;    // ISO string
  status: StatusEvento;
  criadoPor?: {
    id: string;
    nome: string;
  };
  criadoEm: string; // ISO string
}
