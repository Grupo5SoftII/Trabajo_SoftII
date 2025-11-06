import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./Crear_profesor.css";

export default function Crear_profesor() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!nombre || !edad || !email) {
      alert("Por favor complete todos los campos.");
      return;
    }
    if (isNaN(Number(edad)) || Number(edad) <= 0) {
      alert("Ingrese una edad válida.");
      return;
    }

    // Aquí se podría integrar el POST al backend.
    alert(`Profesor creado:\nNombre: ${nombre}\nEdad: ${edad}\nEmail: ${email}`);
    navigate("/admin");
  };

  const handleBack = () => navigate("/admin");

  return (
    <div className="Crear_profesor">
      <Header
        title="Crear Profesor"
        leftButton={{ label: "← Volver", onClick: handleBack }}
        rightButton={{ label: "Cerrar sesión", onClick: () => navigate("/") }}
      />

      <div className="layout d-flex">
        <main className="base p-4">
          <h3 className="mb-4 text-center">Nuevo Profesor</h3>

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Edad</label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Ej. 35"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@escuela.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="crear_profesor btn btn-primary px-4 py-2 mt-3"
            onClick={handleCreate}
          >
            Crear Profesor
          </button>
        </main>
      </div>
    </div>
  );
}
