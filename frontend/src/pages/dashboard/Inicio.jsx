import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inicio.css";

export default function Inicio() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleCodigoChange = (e) => setCodigo(e.target.value);

  const ingresarClase = () => {
    navigate(`/clase/${codigo}`);
  };

  const crearClase = () => {
    navigate("/crear_clase");
  };

  return (
    <div className="inicio-container d-flex justify-content-center align-items-center">
      <div className="inicio-box p-5">
        <h1 className="text-center mb-4">¡Bienvenido!</h1>
        <div className="mb-4">
          <label htmlFor="codigo" className="form-label fs-4">Ingresa el código de clase</label>
          <input
            type="text"
            id="codigo"
            className="form-control form-control-lg"
            value={codigo}
            onChange={handleCodigoChange}
            placeholder="Código de clase"
          />
        </div>
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-primary btn-lg w-75" onClick={ingresarClase}>
            Ingresar a clase
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-secondary btn-lg w-75" onClick={crearClase}>
            Crear clase
          </button>
        </div>
      </div>
    </div>
  );
}
