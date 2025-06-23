import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen w-full max-w-4xl px-4">
      {/* Conteúdo centralizado */}
        <main className="flex-1 flex items-center justify-center py-12">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                
                {/* Coluna 1 - texto e logo */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                    <img src="/eclesial.svg" alt="Logo" className="h-18" />
                    <h1 className="text-3xl font-bold">Eclesial</h1>
                </div>
                <p className="text-muted-foreground text-amber-600">
                    Uma plataforma de gestão de arrecadações...
                </p>
                <p className="text-muted-foreground text-amber-600">
                    Pensada e projetada pra viabilizar que cada gesto de amor em forma de doação faça a diferença!
                </p>
                </div>

                {/* Coluna 2 - formulário */}
                <div className="flex-1 w-full max-w-md">
                <Card>
                    <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
                    <form className="space-y-4">
                        <Input type="email" placeholder="Email" />
                        <Input type="password" placeholder="Senha" />
                        <Button type="submit" className="w-full text-white hover:text-amber-600">Entrar</Button>
                    </form>
                    <p className="text-sm text-center mt-4 text-gray-400">
                        Não tem conta?{" "}
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
      <footer className="w-full py-4 text-center bg-zinc-200 text-zinc-800 flex flex-col items-center gap-2">
        <p>ranieriiuri Developments © 2025</p>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/ranieriiuri/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin className="text-2xl text-slate-700" />
          </a>
          <a
            href="https://github.com/ranieriiuri"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub className="text-2xl text-slate-700" />
          </a>
        </div>
      </footer>
    </div>
  )
}
