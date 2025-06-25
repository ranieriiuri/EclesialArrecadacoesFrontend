import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Footer from "@/components/ui/Footer";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";

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
};

type PasswordForm = {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
};

export default function Account() {
  const { token } = useAuth();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const queryClient = useQueryClient();


  // Toast simples
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Formulário de dados do usuário
  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    reset: resetUser,
    formState: { errors: errorsUser },
  } = useForm<FormData>();

  // Formulário de senha
  const {
    register: registerSenha,
    handleSubmit: handleSubmitSenha,
    reset: resetSenha,
    watch: watchSenha,
    formState: { errors: errorsSenha },
  } = useForm<PasswordForm>();

  useEffect(() => {
    if (user) {
      resetUser({
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
  }, [user, resetUser]);

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (file.size > 5 * 1024 * 1024) {
      showToast("A imagem deve ter no máximo 5MB.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);
  
    try {
      setUploadingFoto(true);
  
      const res = await api.put("/users/me/photo", formData, {
        headers: {
          // NÃO defina Content-Type manualmente, o axios lida com isso
          Authorization: `Bearer ${token}`,
        },
      });
  
      const novaUrl = res.data; // a resposta é a URL da imagem
  
      showToast("Foto atualizada com sucesso!", "success");
  
      // Recarrega para refletir nova foto (ou substitua com mutate/swr)
      window.location.reload();
  
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Erro desconhecido ao enviar foto";
      showToast(errorMsg, "error");
      console.error("Erro upload foto:", err);
    } finally {
      setUploadingFoto(false);
    }
  };
  
  const onSubmitDados = async (data: FormData) => {
    setLoading(true);
    setError(null);
  
    try {
      await api.put("/users/me/data", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Invalida os dados do usuário para forçar o refetch
      await queryClient.invalidateQueries({ queryKey: ["user"] });
  
      showToast("Dados atualizados com sucesso!", "success");
      setEditMode(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Erro ao atualizar dados.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSenha = async (data: PasswordForm) => {
    if (data.novaSenha !== data.confirmarSenha) {
      showToast("A nova senha e a confirmação não coincidem.", "error");
      return;
    }
  
    if (data.novaSenha.length < 6) {
      showToast("A senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }
  
    if (!/[A-Z]/.test(data.novaSenha)) {
      showToast("A senha deve conter pelo menos uma letra maiúscula.", "error");
      return;
    }
  
    if (!/[a-z]/.test(data.novaSenha)) {
      showToast("A senha deve conter pelo menos uma letra minúscula.", "error");
      return;
    }
  
    if (!/\d/.test(data.novaSenha)) {
      showToast("A senha deve conter pelo menos um número.", "error");
      return;
    }
  
    try {
      setLoadingSenha(true);
  
      await api.post(
        "/users/change-password",
        {
          senhaAtual: data.senhaAtual,
          novaSenha: data.novaSenha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      showToast("Senha alterada com sucesso!", "success");
      resetSenha();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Erro ao alterar senha.";
      showToast(errorMsg, "error");
    } finally {
      setLoadingSenha(false);
    }
  };    

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toast simples */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white font-semibold z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

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

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-500">
                {user?.nome?.split(" ")[0] || "Usuário"}
              </h2>
              <p className="text-sm text-zinc-600">Igreja: {user?.igreja.nome}</p>

              {/* Upload da foto */}
              {editMode && (
                <div className="mt-2">
                  <label className="text-sm text-amber-600 font-medium cursor-pointer">
                    <span className="underline">Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadFoto}
                      className="hidden"
                      disabled={uploadingFoto}
                    />
                  </label>
                  {uploadingFoto && (
                    <p className="text-xs text-slate-500 mt-1">Enviando foto...</p>
                  )}
                </div>
              )}
            </div>
</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditMode(!editMode)}
              className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700"
            >
              {editMode ? "Cancelar" : "Editar"}
            </Button>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700"
              >
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-6 border-none shadow-none">
          <h2 className="text-3xl text-amber-600 font-semibold">Meus dados</h2>
          <CardHeader>
            <h3 className="text-md font-semibold mt-6 text-slate-700">Usuário</h3>
          </CardHeader>
          <CardContent>
            {/* Formulário de Dados */}
            <form onSubmit={handleSubmitUser(onSubmitDados)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                {[
                  { label: "Nome", field: "nome" },
                  { label: "Email", field: "email" },
                  { label: "CPF", field: "cpf" },
                  { label: "Cargo", field: "cargo" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-slate-600">
                      {label}
                    </label>
                    <Input
                      {...registerUser(field as keyof FormData)}
                      disabled={!editMode}
                    />
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
                    <label className="text-sm text-slate-600 capitalize">
                      {field}
                    </label>
                    <Input
                      {...registerUser(`endereco.${field}`)}
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
                    <Input
                      {...registerUser(`igreja.${field}`)}
                      disabled={!editMode}
                    />
                  </div>
                ))}
              </div>

              {editMode && (
                <Button
                  className="w-full mt-4 !bg-slate-700 text-white hover:text-amber-600"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              )}

              {error && <p className="text-center text-red-600">{error}</p>}
            </form>

            {/* Formulário de Senha */}
            <form
              onSubmit={handleSubmitSenha(onSubmitSenha)}
              className="mt-10 space-y-4"
            >
              <h3 className="text-md font-semibold text-slate-700">
                Alterar Senha
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <Input
                  {...registerSenha("senhaAtual")}
                  type="password"
                  placeholder="Senha Atual"
                  disabled={!editMode}
                />
                <Input
                  {...registerSenha("novaSenha")}
                  type="password"
                  placeholder="Nova Senha"
                  disabled={!editMode}
                />
                <Input
                  {...registerSenha("confirmarSenha")}
                  type="password"
                  placeholder="Confirmar Nova Senha"
                  disabled={!editMode}
                />
              </div>

              {errorsSenha.confirmarSenha && (
                <p className="text-sm text-red-600">
                  {errorsSenha.confirmarSenha.message}
                </p>
              )}
               {editMode && (
                  <Button
                  className="mt-2 !bg-slate-700 text-white hover:text-amber-600"
                  type="submit"
                  disabled={loadingSenha}
                >
                  {loadingSenha ? "Salvando..." : "Salvar Nova Senha"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
