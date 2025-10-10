import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Vista_profe from "./pages/dashboard/Vista_profe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profe" element={<Vista_profe />} />
      </Routes>
    </Router>
  );
}

export default App;
