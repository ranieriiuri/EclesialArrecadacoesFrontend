import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { AuthProvider } from "@/contexts/AuthContext"; // ⬅️ Importa o provider

function App() {
  return (
    <AuthProvider> {/* ⬅️ Envolve toda a aplicação */}
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
