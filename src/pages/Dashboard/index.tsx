import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.nome || "usuário"}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Sair
      </button>
    </div>
  );
}
