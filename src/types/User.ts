import { Endereco } from './Endereco';
import { Igreja } from './Igreja';

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  cargo?: string;
  endereco: Endereco;
  fotoPerfil?: string;
  igreja: Igreja;
}