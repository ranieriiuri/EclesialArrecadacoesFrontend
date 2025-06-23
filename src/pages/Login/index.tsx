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
                    <img src="/vite.svg" alt="Logo" className="h-16" />
                    <h1 className="text-3xl font-bold">Arrecadações eclesiais</h1>
                </div>
                <p className="text-muted-foreground">
                    Uma plataforma de gestão de doações...
                </p>
                <p className="text-muted-foreground">
                    Pensada, projetada e desenvolvida pra viabilizar cada gesto de amor em forma de doação.
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
                        <Button type="submit" className="w-full">Entrar</Button>
                    </form>
                    <p className="text-sm text-center mt-4 text-gray-400">
                        Não tem conta?{" "}
                        <span 
                        className="text-blue-400 hover:text-green-500 cursor-pointer transition-colors duration-200"
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
      <footer className="w-full py-4 text-center bg-gray-900 text-gray-400 flex flex-col items-center gap-2">
        <p>ranieriiuri Developments © 2025</p>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/seu-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a
            href="https://github.com/seu-github"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </footer>
    </div>
  )
}
