import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Vista_profe from "./pages/dashboard/Vista_profe";
import Crear_clase from "./pages/dashboard/Crear_clase";
import Administrador from "./pages/dashboard/Administrador";
import ListaProfesores from "./pages/dashboard/ListaProfesores";
import HistorialUltimasReuniones from "./pages/dashboard/HistorialUltimasReuniones";
import Login from "./pages/login/Login"; // NUEVA PÁGINA

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* RUTA LOGIN */}
        <Route path="/" element={<Home />} />
        <Route path="/profe" element={<Vista_profe />} />
        <Route path="/crear_clase" element={<Crear_clase />} />
        <Route path="/admin" element={<Administrador />} />
        <Route path="/admin/profesores" element={<ListaProfesores />} />
        <Route path="/admin/reuniones" element={<HistorialUltimasReuniones />} />
      </Routes>
    </Router>
  );
}

export default App;
