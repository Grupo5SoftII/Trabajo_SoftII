import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Crear_alumno.css";

export default function Crear_alumno() {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const Nombre_clase = location.state?.Nombre_clase || "Crear alumno";

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    edad: "",
    tipoUsuario: "Alumno", // Tipo de usuario fijo
    usuario: "",
    password: "",
    confirmPassword: "", // Solo estos dos campos
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cerrar_clase = () => {
    navigate("/crear_clase");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación para asegurarse de que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log("Alumno creado:", formData);
  };

  return (
    <div className="CrearAlumno">
      {/* HEADER */}
      <header className="header d-flex align-items-center px-3">
        <button
          className="btn btn-outline-light me-3"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Ocultar menú" : "Mostrar menú"}
        >
          {menuOpen ? "Ocultar menú" : "Mostrar menú"}
        </button>
        <h1 className="m-0 text-white">{Nombre_clase}</h1>
        <button className="btn btn-outline-light ms-auto" onClick={cerrar_clase}>
          Volver
        </button>
      </header>

      {/* LAYOUT */}
      <div className="layout d-flex">
        <aside className={`menu bg-light ${menuOpen ? "open" : "closed"}`}>
          <nav className="p-3">
            <h5 className="fw-bold mb-3">Opciones</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100 text-start">
                  Lista de alumnos
                </button>
              </li>
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100 text-start">
                  Crear alumno
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="base p-4">
          <div className="form-card">
            <h2 className="mb-4">Registrar nuevo alumno</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    className="form-control form-control-lg"
                    value={formData.nombres}
                    onChange={handleChange}
                    placeholder="Ej. Álvaro Gabriel"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    className="form-control form-control-lg"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Ej. Alayo Barbarán"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    name="edad"
                    className="form-control form-control-lg"
                    value={formData.edad}
                    onChange={handleChange}
                    min="3"
                    placeholder="10"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tipo de usuario</label>
                  <input
                    type="text"
                    name="tipoUsuario"
                    className="form-control form-control-lg"
                    value={formData.tipoUsuario}
                    readOnly // Campo inamovible
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    name="usuario"
                    className="form-control form-control-lg"
                    value={formData.usuario}
                    onChange={handleChange}
                    placeholder="Ej. Alvaro2802"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-lg"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Crear alumno
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
