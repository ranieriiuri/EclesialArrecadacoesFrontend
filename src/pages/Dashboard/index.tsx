import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Package,
  CalendarPlus,
  LayoutDashboard,
  UserCog,
  Medal,
  History,
  BarChart3,
} from "lucide-react";
import UserGreeting from "@/components/ui/UserGreeting";
import Footer from "@/components/ui/Footer";

export default function Dashboard() {
  const { user: authUser, logout } = useAuth(); //Dados básicos
  const { data: user, isLoading, error } = useUser(); // dados completos

  const cards = [
    {
      label: "Dados da Conta",
      icon: UserCog,
      to: "/account",
    },
    {
      label: "Gerenciar Estoque",
      icon: Package,
      to: "/inventory",
    },
    {
      label: "Criar novo Evento",
      icon: CalendarPlus,
      to: "/events/new",
    },
    {
      label: "Painel evento",
      icon: LayoutDashboard,
      to: "/events/panel",
    },
    {
      label: "Eventos Anteriores",
      icon: History,
      to: "/events/history",
    },
    {
      label: "Relatórios de Vendas",
      icon: BarChart3,
      to: "/reports/sales",
    },
    {
      label: "Maior Doador",
      icon: Medal,
      to: "/reports/top-donor",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      {/* Cabeçalho */}
  <CardHeader className="flex items-center justify-between mt-6">
    <UserGreeting user={user} />
  {/* Botão sair */}
  <Button variant="outline" onClick={logout} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
    Deslogar
  </Button>
</CardHeader>



      {/* Conteúdo */}
      <main className="flex-grow px-6 py-10">
        <div className="flex items-center justify-center mb-8 gap-3">
          <img src="/eclesial.svg" alt="Logo Eclesial" className="w-12 h-12 object-contain" />
          <h2 className="text-2xl font-semibold text-zinc-800">
            Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ label, icon: Icon, to }) => (
            <Link to={to} key={label} className="group">
              <Card className="p-6 h-full hover:shadow-xl hover:drop-shadow-[0_8px_6px_rgba(250,250,128,0.2)] hover:bg-slate-900 transition-all cursor-pointer flex flex-col items-center text-center gap-2 border border-amber-600 transition-colors">
                <Icon className="text-4xl text-amber-700" />
                <h3 className="text-lg font-semibold text-zinc-800 group-hover:text-amber-600 transition-colors">{label}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
