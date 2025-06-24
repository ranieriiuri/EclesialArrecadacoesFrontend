import { useUser } from "@/hooks/useUser";

export default function TestePage() {
  const { user, loading, error } = useUser();

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!user) return <p>Nenhum dado encontrado.</p>;

  return (
    <div>
      <h1>Conta de {user.nome}</h1>
      <p>Email: {user.email}</p>
      <p>Igreja: {user.igreja.nome} ({user.igreja.estado})</p>
      <p>Endereço: {user.endereco.logradouro}, {user.endereco.cidade}</p>
    </div>
  );
}
