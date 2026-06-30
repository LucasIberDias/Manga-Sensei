import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/Cadastro";
import Inicio from "./pages/telasPrincipal/telaInicial/TelaInicial"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;