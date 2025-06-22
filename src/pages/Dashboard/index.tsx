import Navbar from "@/components/ui/Navbar"
import FormPeca from "@/components/ui/FormPeca"

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Registrar Nova Peça</h2>
        <FormPeca />
      </main>
    </div>
  )
}
