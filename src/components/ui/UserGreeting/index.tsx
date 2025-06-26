// src/components/UserGreeting.tsx
import { User } from "@/types/User";

interface UserGreetingProps {
  user: User | undefined;
}

export default function UserGreeting({ user }: UserGreetingProps) {
  const primeiroNome = user?.nome?.split(" ")[0] || "usuário";
  const inicial = user?.nome?.[0] || "?";
  const igrejaNome = user?.igreja?.nome;

  return (
    <div className="flex items-center gap-4">
      {/* Círculo da foto */}
      <div className="w-15 h-15 rounded-full bg-gray-200 overflow-hidden">
        {user?.fotoPerfil ? (
          <img
            src={user.fotoPerfil}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-white bg-zinc-400">
            {inicial}
          </div>
        )}
      </div>

      {/* Nome e Igreja */}
      <div className="flex flex-col">
        <h1 className="!text-[17px] font-normal text-amber-600">
          Olá, {primeiroNome}!
        </h1>
        {igrejaNome && (
          <p className="!text-[15px] font-normal text-zinc-600">
            Igreja {igrejaNome}
          </p>
        )}
      </div>
    </div>
  );
}
