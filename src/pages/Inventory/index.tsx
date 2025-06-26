import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePecas } from "@/hooks/usePeca";
import UserGreeting from "@/components/ui/UserGreeting";
import Footer from "@/components/ui/Footer";
import PecaCard from "@/components/ui/PecaCard";
import PecaFormModal from "@/components/ui/PecaFormModal";
import FiltroCategoria from "@/components/ui/FiltroCategoria";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

export default function Inventory() {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const { data: user, isLoading: isUserLoading } = useUser();
  const { pecas, isLoading: isPecasLoading, refetch } = usePecas(categoriaSelecionada);

  const handleFiltro = (categoria: string | null) => {
    setCategoriaSelecionada(categoria);
  };

  const limparFiltro = () => {
    setCategoriaSelecionada(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto w-full">

        {/* Topo com botão voltar + saudação */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-sm !text-[12px] !bg-gray-400 text-white hover:text-amber-700">
            <ArrowLeft />
          </button>
          {!isUserLoading && user && <UserGreeting user={user} />}
        </div>

        {/* Título centralizado */}
        <h2 className="text-4xl font-bold text-center text-amber-600 mb-6">Estoque</h2>

        {/* Botão de cadastro abaixo do título */}
        <br /><br />
        <div className="flex justify-center mb-10">
          <Button onClick={() => setModalAberto(true)} className="!bg-slate-700 text-white hover:text-amber-600">
            Cadastrar nova peça
          </Button>
        </div>

        {/* Modal de cadastro */}
        <PecaFormModal
          aberto={modalAberto}
          onClose={() => setModalAberto(false)}
          onSuccess={() => {
            setModalAberto(false);
            refetch(); // atualiza a listagem ao cadastrar com sucesso
          }}
        />

        {/* Lista de peças */}
        {isPecasLoading ? (
          <p className="text-center text-sm text-zinc-500 mt-10">Carregando peças...</p>
        ) : pecas.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 mt-10">Nenhuma peça encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {pecas.map((peca) => (
              <PecaCard key={peca.id} peca={peca} />
            ))}
          </div>
        )}

        {/* Filtro de categoria */}
        <div className="flex items-center gap-4 justify-center mb-16">
          <FiltroCategoria onChange={handleFiltro} />
          {categoriaSelecionada && (
            <Button variant="outline" onClick={limparFiltro} className="text-white hover:text-amber-600">
              Limpar filtro
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
