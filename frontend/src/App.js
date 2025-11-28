import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas Principales
import Inicio from "./pages/dashboard/Inicio";
import Room from "./pages/dashboard/Room"; 

// Flujo Profesor
import Login_profesor from "./pages/login/Login_profesor";
import Crear_profesor from "./pages/dashboard/Crear_profesor";
import Crear_clase from "./pages/dashboard/Crear_clase"; 

// Flujo Alumno
import Login_alumno from "./pages/login/Login_alumno";
import Crear_alumno from "./pages/dashboard/Crear_alumno";
import Home from "./pages/dashboard/Home"; 

// Componentes y Admin
import AuthBar from "./components/AuthBar";
import Administrador from "./pages/dashboard/Administrador";
import ListaProfesores from "./pages/dashboard/ListaProfesores";
import HistorialUltimasReuniones from "./pages/dashboard/HistorialUltimasReuniones";

function App() {
  return (
    <Router>
      <AuthBar />
      <Routes>
        {/* --- PÚBLICO --- */}
        <Route path="/" element={<Inicio />} />
        
        {/* --- LOGINS --- */}
        <Route path="/login/profesor" element={<Login_profesor />} />
        <Route path="/login/alumno" element={<Login_alumno />} />
        
        {/* --- REGISTROS --- */}
        <Route path="/crear_profesor" element={<Crear_profesor />} />
        <Route path="/crear_alumno" element={<Crear_alumno />} />

        {/* --- RUTAS DEL PROFESOR --- */}
        <Route path="/crear_clase" element={<Crear_clase />} />
        <Route path="/profe" element={<Crear_clase />} /> 

        {/* --- RUTAS DEL ALUMNO --- */}
        <Route path="/home" element={<Home />} />

        {/* --- SALA EN VIVO --- */}
        <Route path="/room/:roomId" element={<Room />} />

        {/* --- ADMIN --- */}
        <Route path="/admin" element={<Administrador />} />
        <Route path="/admin/profesores" element={<ListaProfesores />} />
        <Route path="/admin/reuniones" element={<HistorialUltimasReuniones />} />

      </Routes>
    </Router>
  );
}

export default App;