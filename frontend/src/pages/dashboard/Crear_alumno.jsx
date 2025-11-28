import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config"; // Asegúrate de tener este archivo
import "./Crear_alumno.css";

export default function Crear_alumno() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",      // Será el usuario para login
    apellido: "",
    edad: "",
    tipoUsuario: "Estudiante", // Visual
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate("/login/alumno");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.password.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // 2. Preparar el payload para el Backend (Alineado con server.ts)
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: parseInt(formData.edad) || 0,
        tipo: "ALUMNO", // Valor fijo para la BD
        contrasena: formData.password
      };

      // 3. Enviar al Backend
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear el usuario");
      }

      // 4. Éxito
      alert("¡Alumno creado exitosamente!");
      navigate("/login/alumno"); // Redirigir al login para que entre

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kahoot-layout">
      {/* Botón volver */}
      <button className="btn-back" onClick={handleBack}>
        ← Volver
      </button>

      <main className="kahoot-center">
        <h1 className="pictotap-logo-small">Registro</h1>

        <div className="kahoot-card register-card">
          <h2 className="login-heading">Nuevo Estudiante</h2>
          <p className="login-subtext">Crea tu perfil para unirte a las clases</p>

          {error && <div className="error-badge">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form-grid">
            
            {/* NOMBRE (Usuario) */}
            <div className="form-group">
              <label>Nombre (Usuario)</label>
              <input
                type="text"
                name="nombre"
                className="kahoot-input-field"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Manuel"
                required
              />
            </div>

            {/* APELLIDO */}
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                className="kahoot-input-field"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej. Revilla"
                required
              />
            </div>

            {/* EDAD */}
            <div className="form-group half">
              <label>Edad</label>
              <input
                type="number"
                name="edad"
                className="kahoot-input-field"
                value={formData.edad}
                onChange={handleChange}
                placeholder="10"
                min="3"
                required
              />
            </div>

            {/* TIPO (Solo lectura) */}
            <div className="form-group half">
              <label>Perfil</label>
              <input
                type="text"
                name="tipoUsuario"
                className="kahoot-input-field readonly"
                value="Estudiante"
                readOnly
              />
            </div>

            {/* CONTRASEÑA */}
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                className="kahoot-input-field"
                value={formData.password}
                onChange={handleChange}
                placeholder="******"
                required
              />
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="kahoot-input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="******"
                required
              />
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="kahoot-btn-action"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Cuenta"}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Decoración de fondo */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
    </div>
  );
}