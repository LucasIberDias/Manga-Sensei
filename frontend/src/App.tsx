import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/Cadastro";
import Inicio from "./pages/telasPrincipal/telaInicial/TelaInicial"
import Pesquisa from "./components/Inputs/InputPesquisa"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/teste" element={<Pesquisa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;