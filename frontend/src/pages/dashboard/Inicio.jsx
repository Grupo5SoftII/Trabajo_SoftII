import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inicio.css";

export default function Inicio() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleCodigoChange = (e) => setCodigo(e.target.value);

  const ingresarClase = () => {
    if (codigo.length === 4) {
      navigate(`/room/${codigo}`);
    }
  };

  const crearClase = () => {
    navigate("/crear_clase");
  };

  const goLoginAlumno = () => navigate('/login/alumno');
  const goLoginProfesor = () => navigate('/login/profesor');

  return (
    <div className="inicio-container d-flex justify-content-center align-items-center">
      <button className="btn btn-outline-primary inicio-login-btn left" onClick={goLoginAlumno}>
        Log-in Alumnos
      </button>
      <button className="btn btn-outline-success inicio-login-btn right" onClick={goLoginProfesor}>
        Log-In Profesor
      </button>
      <div className="inicio-box p-5">
        <h1 className="text-center mb-4">¡Bienvenido!</h1>
        <div className="mb-4">
          <label htmlFor="codigo" className="form-label fs-4">Ingresa el código de clase</label>
          <input
            type="text"
            id="codigo"
            className="form-control form-control-lg"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0,4))}
            placeholder="0000"
            maxLength={4}
          />
        </div>
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-primary btn-lg w-75" onClick={ingresarClase} disabled={codigo.length !== 4}>
            Unirse a reunión
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
