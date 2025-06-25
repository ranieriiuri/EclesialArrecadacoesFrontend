import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import clsx from "clsx"; // Para animar erro
import Footer from "@/components/ui/Footer";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [formError, setFormError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !senha) {
      setFormError("Preencha todos os campos.");
      return;
    }

    try {
      await login(email, senha);
      navigate("/dashboard");
    } catch (err) {
      setShake(true);
    }
  };

  useEffect(() => {
    if (shake) {
      const timeout = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [shake]);

  return (
    <div className="flex flex-col min-h-screen w-full px-0">
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
          {/* Texto e logo */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <img src="/eclesial.svg" alt="Logo" className="h-18" />
              <h1 className="text-7xl font-bold ">Eclesial</h1>
            </div>
            <p className="text-muted-foreground text-amber-600 ">
              Uma plataforma open source de gestão de arrecadações para igrejas...
            </p>
            <p className="text-muted-foreground text-amber-600">
              Projetada para que cada gesto de amor em forma de doação faça a diferença.
            </p>
          </div>

          {/* Formulário */}
          <div className="flex-1 w-full max-w-md">
            <Card className={clsx({ "animate-shake": shake })}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    aria-label="Senha"
                  />
                  <Button type="submit" className="w-full text-white hover:text-amber-600" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                {(formError || error) && (
                  <p className="text-red-600 text-sm mt-2 text-center">
                    {formError || error}
                  </p>
                )}

                <p className="text-sm text-center mt-4 text-gray-400">
                  Ainda não tem conta?{" "}
                  <span
                    className="text-amber-600 hover:text-blue-400 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/register")}
                  >
                    Cadastre-se
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
