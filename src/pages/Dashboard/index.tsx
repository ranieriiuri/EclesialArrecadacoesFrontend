import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header com perfil */}
      <div className="flex items-center gap-6">
        {user?.fotoPerfil && (
          <img
            src={user.fotoPerfil}
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-300"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {user?.nome || "usuário"}!</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Menu com funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardMenu title="Nova Arrecadação" to="/eventos/novo" />
        <CardMenu title="Estoque de Peças" to="/pecas" />
        <CardMenu title="Vendas" to="/vendas" />
        <CardMenu title="Relatórios" to="/relatorios" />
        <CardMenu title="Maior Doador" to="/ranking" />
        <CardMenu title="Minha Conta" to="/conta" />
      </div>

      {/* Botão de logout */}
      <Button onClick={logout} variant="destructive" className="mt-6">
        Sair
      </Button>
    </div>
  );
}

// Componente reutilizável para os cards
function CardMenu({ title, to }: { title: string; to: string }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(to)}
      className="p-6 cursor-pointer hover:bg-zinc-100 transition rounded-xl shadow-sm"
    >
      <h2 className="text-lg font-medium">{title}</h2>
    </Card>
  );
}
