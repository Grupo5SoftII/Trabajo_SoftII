import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Vista_profe from "./pages/dashboard/Vista_profe";
import Crear_clase from "./pages/dashboard/Crear_clase";
import Crear_profesor from "./pages/dashboard/Crear_profesor";
import Administrador from "./pages/dashboard/Administrador";
import ListaProfesores from "./pages/dashboard/ListaProfesores";
import HistorialUltimasReuniones from "./pages/dashboard/HistorialUltimasReuniones";
import Login from "./pages/login/Login";
import Room from "./pages/dashboard/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* RUTA LOGIN */}
        <Route path="/" element={<Home />} />
        <Route path="/profe" element={<Vista_profe />} />
        <Route path="/crear_clase" element={<Crear_clase />} />
        <Route path="/crear_profesor" element={<Crear_profesor />} />
        <Route path="/admin" element={<Administrador />} />
        <Route path="/admin/profesores" element={<ListaProfesores />} />
        <Route path="/admin/reuniones" element={<HistorialUltimasReuniones />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
