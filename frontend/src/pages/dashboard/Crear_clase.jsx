import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./Crear_clase.css";
import useLogin from "../../hooks/useLogin";

export default function Vista_profe() {
  const [Nombre_clase, setNombre_clase] = useState("");
  const navigate = useNavigate();
  const { user } = useLogin();

  const handleCreate = () => {
    // Only allow professors to create rooms
    const role = (user && (user.tipo || user.role || "")).toString().toUpperCase();
    if (role !== "PROFESOR") {
      alert("Solo usuarios con rol PROFESOR pueden crear una clase. Por favor inicie sesión como profesor.");
      navigate("/login/profesor");
      return;
    }

    // Expect a 4-digit numeric code
    const code = (Nombre_clase || "").toString().trim();
    if (!/^[0-9]{4}$/.test(code)) {
      alert("El nombre de la clase debe ser un código numérico de 4 dígitos.");
      return;
    }

    // Navigate to the room; Room component will render the profesor perspective
    navigate(`/room/${code}`, { state: { Nombre_clase: code } });
  };

  return (
    <div className="Vista_profe">
      <header className="header d-flex align-items-center px-3">

        <h1 className="m-0 text-white">Crear clase</h1>
        <button className="btn btn-outline-light ms-auto">
            Cerrar sesion
        </button>
      </header>

      <div className="layout d-flex">
        <main className="base p-4">
          <h3 className="mb-4 text-center">Nueva Clase</h3>

          <div className="mb-3">
            <label className="form-label">Nombre de la clase (código 4 dígitos)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. 1234"
              value={Nombre_clase}
              onChange={(e) => setNombre_clase(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
           <button className="crear_clase btn btn-primary px-4 py-2 mt-3" onClick={handleCreate}>
            Crear clase
          </button>
        </main>
      </div>
    </div>
  );
}