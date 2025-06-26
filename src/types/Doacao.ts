import { Doador } from "./Doador";

export interface Doacao {
  id: string;
  nomePeca: string;
  doador: Doador;
  quantidade: number;
  dataDoacao: string;
}
