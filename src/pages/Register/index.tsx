import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/ui/Footer";

type FormData = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cargo?: string;
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
  igreja: {
    nome: string;
    cnpj: string;
    cidade: string;
    estado: string;
  };
};

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { register: registerUser, loading, error } = useAuth();

  const onSubmit = async (data: FormData) => {
    const success = await registerUser(data);
    if (success) {
      // já redireciona
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Conteúdo */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 w-full">
        <Card className="w-full max-w-5xl p-8">
          <CardContent>
            <h2 className="text-3xl font-semibold mb-6 text-center">Registro de usuário</h2>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Sessão: Usuário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("nome", { required: "Nome é obrigatório" })}
                    placeholder="Nome completo"
                  />
                  {errors.nome && <p className="text-red-600 text-sm">{errors.nome.message}</p>}
                </div>
                <div>
                  <Input
                    {...register("email", {
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                      },
                    })}
                    placeholder="Email"
                  />
                  {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <Input
                    {...register("senha", { required: "Senha é obrigatória" })}
                    type="password"
                    placeholder="Senha"
                  />
                  {errors.senha && <p className="text-red-600 text-sm">{errors.senha.message}</p>}
                </div>
                <div>
                  <Input
                    {...register("cpf", {
                      required: "CPF é obrigatório",
                      pattern: {
                        value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                        message: "CPF inválido (use formato 000.000.000-00)",
                      },
                    })}
                    placeholder="CPF"
                  />
                  {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Input {...register("cargo")} placeholder="Cargo (opcional)" />
                </div>
              </div>

              {/* Sessão: Endereço */}
              <h3 className="text-xl font-semibold mt-8">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "cep" as const, label: "CEP" },
                  { name: "logradouro" as const, label: "Logradouro" },
                  { name: "numero" as const, label: "Número (ou SN)" },
                  { name: "complemento" as const, label: "Complemento" },
                  { name: "bairro" as const, label: "Bairro" },
                  { name: "cidade" as const, label: "Cidade" },
                  { name: "estado" as const, label: "Estado" },
                  { name: "pais" as const, label: "País" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <Input
                      {...register(`endereco.${name}`, {
                        required:
                          name !== "complemento" ? `${label} é obrigatório` : false,
                      })}
                      placeholder={label}
                    />
                    {errors.endereco?.[name] && (
                      <p className="text-red-600 text-sm">
                        {errors.endereco[name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Sessão: Igreja */}
              <h3 className="text-xl font-semibold mt-8">Igreja</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "nome" as const, label: "Nome da Igreja" },
                  { name: "cnpj" as const, label: "CNPJ" },
                  { name: "cidade" as const, label: "Cidade" },
                  { name: "estado" as const, label: "Estado" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <Input
                    {...register(`igreja.${name}`, {
                      required: name !== "cnpj" ? `${label} é obrigatório` : false,
                    })}
                      placeholder={label}
                    />
                    {errors.igreja?.[name] && (
                      <p className="text-red-600 text-sm">
                        {errors.igreja[name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Botões e mensagens */}
              <Button className="w-full mt-4 text-white hover:text-amber-600" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
              </Button>

              {error && <p className="text-red-600 text-center mt-2">{error}</p>}

              <p className="text-sm text-center mt-4">
                Já tem conta?{" "}
                <span
                  className="text-amber-600 hover:underline hover:text-blue-600 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Faça login
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Rodapé fora do Card, com largura total */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
