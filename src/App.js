import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Vista_profe from "./pages/dashboard/Vista_profe";
import Crear_clase from "./pages/dashboard/Crear_clase";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profe" element={<Vista_profe />} />
        <Route path="/crear_clase" element={<Crear_clase />} />
      </Routes>
    </Router>
  );
}

export default App;
