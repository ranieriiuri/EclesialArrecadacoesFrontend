import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function FormPeca() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // lógica de envio aqui
  }

  return (
    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <Input type="text" placeholder="Nome da peça" />
      <Textarea placeholder="Descrição da peça" />
      <Input type="file" accept="image/*" />
      <Button type="submit">Enviar</Button>
    </form>
  )
}
