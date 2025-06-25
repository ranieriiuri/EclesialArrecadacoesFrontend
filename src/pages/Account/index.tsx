// src/pages/Account.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Footer from "@/components/ui/Footer";
import { Link } from "react-router-dom";

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  cargo?: string;
  igreja: {
    nome: string;
    cnpj?: string;
    cidade?: string;
    estado?: string;
  };
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  senhaAtual?: string;
  novaSenha?: string;
  confirmarSenha?: string;
};

export default function Account() {
  const { token, logout } = useAuth();
  const { data: user, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        cargo: user.cargo,
        igreja: {
          nome: user.igreja.nome,
          cnpj: user.igreja.cnpj,
          cidade: user.igreja.cidade,
          estado: user.igreja.estado,
        },
        endereco: user.endereco,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://localhost:8443/usuarios/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erro ao atualizar dados.");
      }

      alert("Dados atualizados com sucesso!");
      setEditMode(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const novaSenha = watch("novaSenha");
  const confirmarSenha = watch("confirmarSenha");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 ">
      <main className="flex-grow px-6 py-10 max-w-7xl mx-auto w-full">
        {/* Topo com Foto e Nome */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-300 text-white flex items-center justify-center text-xl">
              {user?.fotoPerfil ? (
                <img
                  src={user.fotoPerfil}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.nome?.[0] || "?"
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-500">
                {user?.nome?.split(" ")[0] || "Usuário"}
              </h2>
              <p className="text-sm text-zinc-600">Igreja: {user?.igreja.nome}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(!editMode)} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
              {editMode ? "Cancelar" : "Editar"}
            </Button>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">Voltar</Button>
            </Link>
          </div>
        </div>

        <Card className="p-6 border-none shadow-none">
          <h2 className="text-3xl text-amber-600 font-semibold">Meus dados</h2>
          <CardHeader>
            <h3 className="text-md font-semibold mt-6 text-slate-700">Usuário</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campos Básicos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                {[
                  { label: "Nome", field: "nome" },
                  { label: "Email", field: "email" },
                  { label: "CPF", field: "cpf" },
                  { label: "Cargo", field: "cargo" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-slate-600">{label}</label>
                    <Input {...register(field as keyof FormData)} disabled={!editMode} />
                  </div>
                ))}
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    "cep",
                    "logradouro",
                    "numero",
                    "complemento",
                    "bairro",
                    "cidade",
                    "estado",
                    "pais",
                  ] as const
                ).map((field) => (
                  <div key={field}>
                    <label className="text-sm text-slate-600 capitalize">{field}</label>
                    <Input
                      {...register(`endereco.${field}`)}
                      disabled={!editMode}
                    />
                  </div>
                ))}
              </div>

              {/* Igreja */}
              <h3 className="text-md font-semibold mt-6 text-slate-700">Igreja</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    { field: "nome", label: "Nome" },
                    { field: "cnpj", label: "CNPJ" },
                    { field: "cidade", label: "Cidade" },
                    { field: "estado", label: "Estado" },
                  ] as const
                ).map(({ field, label }) => (
                  <div key={field}>
                    <label className="text-sm text-slate-600">{label}</label>
                    <Input {...register(`igreja.${field}`)} disabled={!editMode} />
                  </div>
                ))}
              </div>
              <br />
                <h4 className="text-slate-500">* Para alterar a senha do usuário, clique no botão "Editar" acima.</h4>
              
              {/* Senhas */}
              {editMode && (
                <>
                  <h3 className="text-md font-semibold mt-6 text-slate-700">Alterar Senha</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      {...register("senhaAtual")}
                      type="password"
                      placeholder="Senha Atual"
                    />
                    <Input
                      {...register("novaSenha")}
                      type="password"
                      placeholder="Nova Senha"
                    />
                    <Input
                      {...register("confirmarSenha", {
                        validate: (value) =>
                          !novaSenha || value === novaSenha || "As senhas não conferem",
                      })}
                      type="password"
                      placeholder="Confirmar Nova Senha"
                    />
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-sm text-red-600">{errors.confirmarSenha.message}</p>
                  )}
                </>
              )}

              {/* Botão de salvar */}
              {editMode && (
                <Button className="w-full mt-4 !bg-slate-700 text-white hover:text-amber-600" type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              )}

              {error && <p className="text-center text-red-600">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
