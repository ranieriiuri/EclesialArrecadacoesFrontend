import { useUser } from "@/hooks/useUser";

export default function TestingPage() {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados do usuário!</p>;
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
