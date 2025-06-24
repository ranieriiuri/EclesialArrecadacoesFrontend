import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Footer from "@/components/ui/Footer";

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  cargo?: string;
  igrejaNome?: string;
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

export default function Conta() {
  const { user, token, logout, loading: authLoading, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    defaultValues: {
      nome: user?.nome || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
      cargo: user?.cargo || "",
      igrejaNome: user?.igrejaNome || "",
      endereco: {
        cep: user?.endereco?.cep || "",
        logradouro: user?.endereco?.logradouro || "",
        numero: user?.endereco?.numero || "",
        complemento: user?.endereco?.complemento || "",
        bairro: user?.endereco?.bairro || "",
        cidade: user?.endereco?.cidade || "",
        estado: user?.endereco?.estado || "",
        pais: user?.endereco?.pais || "",
      }
    }
  });

  // Para sincronizar formulário caso user atualize
  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        cargo: user.cargo || "",
        igrejaNome: user.igrejaNome || "",
        endereco: {
          cep: user.endereco?.cep || "",
          logradouro: user.endereco?.logradouro || "",
          numero: user.endereco?.numero || "",
          complemento: user.endereco?.complemento || "",
          bairro: user.endereco?.bairro || "",
          cidade: user.endereco?.cidade || "",
          estado: user.endereco?.estado || "",
          pais: user.endereco?.pais || "",
        }
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      // Chame o endpoint PUT /usuarios/me (exemplo) para atualizar dados do usuário
      const response = await fetch("http://localhost:8080/usuarios/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar dados.");
      }

      // Se precisar atualizar o contexto com os novos dados, pode chamar login ou atualizar o user no contexto (ajustar seu AuthContext)
      alert("Dados atualizados com sucesso!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemplo simples para alteração de senha (pode fazer parte do mesmo form ou formulário separado)
  const novaSenha = watch("novaSenha");
  const confirmarSenha = watch("confirmarSenha");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow px-6 py-8 max-w-5xl mx-auto w-full">
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-2xl font-semibold mb-6 text-center text-amber-600">
              Dados da Conta
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("nome", { required: "Nome é obrigatório" })}
                    placeholder="Nome completo"
                  />
                  {errors.nome && (
                    <p className="text-red-600 text-sm">{errors.nome.message}</p>
                  )}
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
                  {errors.email && (
                    <p className="text-red-600 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    {...register("cpf", {
                      required: "CPF é obrigatório",
                      pattern: {
                        value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                        message: "CPF inválido (formato 000.000.000-00)",
                      },
                    })}
                    placeholder="CPF"
                  />
                  {errors.cpf && (
                    <p className="text-red-600 text-sm">{errors.cpf.message}</p>
                  )}
                </div>

                <div>
                  <Input {...register("cargo")} placeholder="Cargo (opcional)" />
                </div>

                <div className="md:col-span-2">
                  <Input
                    {...register("igrejaNome")}
                    placeholder="Nome da Igreja"
                  />
                </div>

                {/* Endereço */}
                {[
                { name: "cep", label: "CEP", required: true },
                { name: "logradouro", label: "Logradouro", required: true },
                { name: "numero", label: "Número", required: true },
                { name: "complemento", label: "Complemento", required: false },
                { name: "bairro", label: "Bairro", required: true },
                { name: "cidade", label: "Cidade", required: true },
                { name: "estado", label: "Estado", required: true },
                { name: "pais", label: "País", required: true },
                ].map(({ name, label, required }) => {
                const fieldName = name as keyof FormData["endereco"];
                return (
                    <div key={name}>
                    <Input
                        {...register(`endereco.${fieldName}`, {
                        required: required ? `${label} é obrigatório` : false,
                        })}
                        placeholder={label}
                    />
                    {errors.endereco?.[fieldName] && (
                        <p className="text-red-600 text-sm">
                        {errors.endereco[fieldName]?.message}
                        </p>
                    )}
    </div>
  );
})}


                {/* Senha Atual */}
                <div>
                  <Input
                    {...register("senhaAtual")}
                    type="password"
                    placeholder="Senha Atual (para confirmar alterações)"
                  />
                </div>

                {/* Nova Senha */}
                <div>
                  <Input
                    {...register("novaSenha", {
                      validate: (value) =>
                        !value || (value.length >= 6) || "Nova senha deve ter pelo menos 6 caracteres",
                    })}
                    type="password"
                    placeholder="Nova Senha"
                  />
                  {errors.novaSenha && (
                    <p className="text-red-600 text-sm">{errors.novaSenha.message}</p>
                  )}
                </div>

                {/* Confirmar Nova Senha */}
                <div>
                  <Input
                    {...register("confirmarSenha", {
                      validate: (value) =>
                        !novaSenha || value === novaSenha || "As senhas não conferem",
                    })}
                    type="password"
                    placeholder="Confirmar Nova Senha"
                  />
                  {errors.confirmarSenha && (
                    <p className="text-red-600 text-sm">{errors.confirmarSenha.message}</p>
                  )}
                </div>
              </div>

              <Button
                className="w-full mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>

              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
