import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./Crear_clase.css";

export default function Vista_profe() {
    const [Nombre_clase, setNombre_clase] = useState("");
    const navigate = useNavigate();

    const handleCreate = () => {
        if (!Nombre_clase) {
        alert("Por favor, ingrese un nombre para la clase.");
        return;
        }
        navigate("/profe", { state: { Nombre_clase } });
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
            <label className="form-label">Nombre de la clase</label>
            <input type="text" className="form-control" placeholder="Ej. Clase mate" value={Nombre_clase} onChange={(e) => setNombre_clase(e.target.value)}/>
          </div>
           <button className="crear_clase btn btn-primary px-4 py-2 mt-3" onClick={handleCreate}>
            Crear clase
          </button>
        </main>
      </div>
    </div>
  );
}