import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-center">Cadastro</h2>
          <form className="space-y-4">
            <Input type="text" placeholder="Nome completo" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Senha" />
            <Button className="w-full" type="submit">Registrar</Button>
          </form>
          <p className="text-sm text-center mt-4">
            Já tem conta?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/")}
            >
              Faça login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
