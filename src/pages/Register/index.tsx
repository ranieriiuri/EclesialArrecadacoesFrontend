import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
      // já redireciona no contexto, mas caso queira, pode navegar aqui também
      // navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 overflow-auto max-h-[90vh]">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-center">Cadastro</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Nome */}
            <div>
              <Input
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome completo"
              />
              {errors.nome && (
                <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>

            {/* Email */}
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
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <Input
                {...register("senha", { required: "Senha é obrigatória" })}
                type="password"
                placeholder="Senha"
              />
              {errors.senha && (
                <p className="text-red-600 text-sm mt-1">{errors.senha.message}</p>
              )}
            </div>

            {/* CPF */}
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
              {errors.cpf && (
                <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>
              )}
            </div>

            {/* Cargo */}
            <div>
              <Input {...register("cargo")} placeholder="Cargo (opcional)" />
            </div>

            <h3 className="mt-6 font-semibold">Endereço</h3>
            {[
              { name: "cep" as const, label: "CEP", required: true },
              { name: "logradouro" as const, label: "Logradouro", required: true },
              { name: "numero" as const, label: "Número", required: true },
              { name: "complemento" as const, label: "Complemento", required: false },
              { name: "bairro" as const, label: "Bairro", required: true },
              { name: "cidade" as const, label: "Cidade", required: true },
              { name: "estado" as const, label: "Estado", required: true },
              { name: "pais" as const, label: "País", required: true },
            ].map(({ name, label, required }) => (
              <div key={name}>
                <Input
                  {...register(`endereco.${name}`, {
                    required: required ? `${label} é obrigatório` : false,
                  })}
                  placeholder={label}
                />
                {errors.endereco?.[name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.endereco[name]?.message}
                  </p>
                )}
              </div>
            ))}

            <h3 className="mt-6 font-semibold">Igreja</h3>
            {[
              { name: "nome" as const, label: "Nome da Igreja", required: true },
              { name: "cnpj" as const, label: "CNPJ", required: true },
              { name: "cidade" as const, label: "Cidade da Igreja", required: true },
              { name: "estado" as const, label: "Estado da Igreja", required: true },
            ].map(({ name, label, required }) => (
              <div key={name}>
                <Input
                  {...register(`igreja.${name}`, {
                    required: required ? `${label} é obrigatório` : false,
                  })}
                  placeholder={label}
                />
                {errors.igreja?.[name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.igreja[name]?.message}
                  </p>
                )}
              </div>
            ))}

            <Button
              className="w-full mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>

            {error && (
              <p className="text-red-600 text-center mt-2">{error}</p>
            )}

            <p className="text-sm text-center mt-4">
              Já tem conta?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/")}
              >
                Faça login
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
