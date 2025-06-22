import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Sistema de Doações</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <button className="text-red-500 hover:underline">Sair</button>
      </div>
    </nav>
  )
}
