import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config";
import "./Crear_profesor.css";

export default function Crear_profesor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",      // Usuario para login
    apellido: "",
    edad: "",
    tipoUsuario: "Profesor", // Visual
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
    navigate("/login/profesor");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validaciones
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
      // 2. Payload para el Backend (Alineado con DB Azure)
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: parseInt(formData.edad) || 0,
        tipo: "PROFESOR", // Valor fijo interno
        contrasena: formData.password
      };

      // 3. Petición API
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear el profesor");
      }

      // 4. Éxito
      alert("¡Cuenta de profesor creada! Ahora puedes iniciar sesión.");
      navigate("/login/profesor");

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
        <h1 className="pictotap-logo-small">PICTOTAP</h1>

        <div className="kahoot-card register-card-teacher">
          <h2 className="login-heading">Nuevo Docente</h2>
          <p className="login-subtext">Crea tu cuenta para gestionar clases</p>

          {error && <div className="error-badge">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form-grid">
            
            {/* NOMBRE */}
            <div className="form-group">
              <label>Nombre (Usuario)</label>
              <input
                type="text"
                name="nombre"
                className="kahoot-input-field"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Álvaro"
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
                placeholder="Ej. Alayo"
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
                placeholder="30"
                min="18"
              />
            </div>

            {/* TIPO (Solo lectura) */}
            <div className="form-group half">
              <label>Perfil</label>
              <input
                type="text"
                name="tipoUsuario"
                className="kahoot-input-field readonly"
                value="Profesor"
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
                className="kahoot-btn-action btn-teacher-action"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Decoración */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
    </div>
  );
}