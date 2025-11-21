import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Vista_profe from "./pages/dashboard/Vista_profe";
import Crear_clase from "./pages/dashboard/Crear_clase";
import Crear_profesor from "./pages/dashboard/Crear_profesor";
import Administrador from "./pages/dashboard/Administrador";
import ListaProfesores from "./pages/dashboard/ListaProfesores";
import HistorialUltimasReuniones from "./pages/dashboard/HistorialUltimasReuniones";
import Login_profesor from "./pages/login/Login_profesor";
import Login_alumno from "./pages/login/Login_alumno";
import Room from "./pages/dashboard/Room";
import Inicio from "./pages/dashboard/Inicio";
import Crear_alumno from "./pages/dashboard/Crear_alumno";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login/profesor" element={<Login_profesor />} />
        <Route path="/login/alumno" element={<Login_alumno />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/profe" element={<Vista_profe />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crear_clase" element={<Crear_clase />} />
        <Route path="/crear_profesor" element={<Crear_profesor />} />
        <Route path="/admin" element={<Administrador />} />
        <Route path="/admin/profesores" element={<ListaProfesores />} />
        <Route path="/admin/reuniones" element={<HistorialUltimasReuniones />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/crear_alumno" element={<Crear_alumno />} />
      </Routes>
    </Router>
  );
}

export default App;
