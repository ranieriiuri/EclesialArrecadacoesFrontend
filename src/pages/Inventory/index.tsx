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
import { Peca } from "@/types/Peca";

export default function Inventory() {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [pecaParaEditar, setPecaParaEditar] = useState<Peca | undefined>(undefined); // ✅ NOVO
  const { pecas, isLoading: isPecasLoading, refetch, excluir } = usePecas(categoriaSelecionada); // ✅ IMPORTANTE: excluir
  const { data: user, isLoading: isUserLoading } = useUser();

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
          pecaExistente={pecaParaEditar}
          onClose={() => {
            setModalAberto(false);
            setPecaParaEditar(undefined);
          }}
          onSuccess={() => {
            setModalAberto(false);
            setPecaParaEditar(undefined);
            refetch(); // ✅ Atualiza a listagem após cadastro ou edição
          }}
        />


        {/* Lista de peças */}
        {isPecasLoading ? (
          <p className="text-center text-sm text-zinc-500 mt-10">Carregando peças...</p>
        ) : pecas.length === 0 ? (
          <p className="text-center text-sm text-red-500 mt-10">Nenhuma peça encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {pecas.map((peca) => (
              <PecaCard
              key={peca.id}
              peca={peca}
              onEditar={(p) => {
                setPecaParaEditar(p);        // seta a peça que será editada
                setModalAberto(true);        // abre o modal com os dados da peça
              }}
              onExcluir={(id) => {
                excluir.mutate(id, {
                  onSuccess: () => refetch(), // atualiza a lista após excluir
                });
              }}
            />
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
