import { Doador } from "./Doador";
import { Peca } from "./Peca";

export interface Doacao {
  id: string;
  peca: Peca;
  doador: Doador;
  quantidade: number;
  dataDoacao: string;
}
