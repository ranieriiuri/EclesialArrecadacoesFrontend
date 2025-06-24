import { Endereco } from './Endereco';
import { Igreja } from './Igreja';

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  cargo?: string;
  fotoPerfil?: string;
  endereco: Endereco;
  igreja: Igreja;
}