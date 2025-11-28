import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { API_BASE } from "../../api/config";
import "./Crear_clase.css"; 

export default function Crear_clase() {
  const [materia, setMateria] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useLogin();

  // Generar código aleatorio al cargar la página
  useEffect(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(randomCode);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreate = async () => {
    // 1. Verificar Rol
    const role = (user && (user.tipo || user.role || "")).toString().toUpperCase();
    if (role !== "PROFESOR") {
      alert("Acceso denegado. Solo profesores pueden crear clases.");
      navigate("/login/profesor");
      return;
    }

    // 2. Validar Materia
    if (!materia.trim()) {
      alert("Por favor ingresa el nombre de la materia.");
      return;
    }

    setLoading(true);

    try {
      // 3. Crear Aula en la Base de Datos (Azure)
      // Usamos el endpoint POST /aulas que definimos en server.ts
      const payload = {
        materia: materia,
        grado: "General",
        profesorId: user.id,
        codigo: parseInt(generatedCode) 
      };

      const res = await fetch(`${API_BASE}/aulas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear el aula");
      }

      // 4. Crear el Chat asociado al Aula automáticamente
      await fetch(`${API_BASE}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aulaId: data.id })
      });

      // 5. Navegar a la sala
      navigate(`/room/${generatedCode}`, { 
        state: { 
          Nombre_clase: materia,
          Codigo_clase: generatedCode 
        } 
      });

    } catch (error) {
      console.error("Error creando clase:", error);
      alert("Hubo un error al crear la clase. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kahoot-layout">
      
      {/* HEADER SUPERIOR */}
      <nav className="profe-navbar">
        <div className="user-info">
          <div className="avatar-circle-profe">
            {user?.nombre?.charAt(0) || "P"}
          </div>
          <span className="user-name">Prof. {user?.nombre || "Usuario"}</span>
        </div>
        <button className="btn-logout-ghost" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </nav>

      {/* CONTENIDO CENTRAL */}
      <main className="kahoot-center">
        <h1 className="pictotap-logo-small">Nueva Clase</h1>

        <div className="kahoot-card create-class-card">
          <h2 className="card-title">Configurar Aula</h2>
          <p className="card-subtitle">Define la materia y comparte el código.</p>

          <div className="form-content">
            
            {/* INPUT MATERIA */}
            <div className="input-group-left">
              <label className="input-label">Nombre de la Materia</label>
              <input
                type="text"
                className="kahoot-input-field"
                placeholder="Ej. Matemáticas, Historia..."
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                autoFocus
              />
            </div>

            {/* CÓDIGO AUTOMÁTICO (Solo lectura) */}
            <div className="input-group-left mt-3">
              <label className="input-label">Código Generado</label>
              <div className="generated-code-display">
                {generatedCode}
              </div>
              <small className="code-note">Comparte este código con tus alumnos</small>
            </div>

          </div>

          <button 
            className="kahoot-btn-action btn-create-class" 
            onClick={handleCreate}
            disabled={!materia.trim() || loading}
          >
            {loading ? "Creando..." : "Iniciar Clase"}
          </button>
        </div>
      </main>

      {/* Formas Decorativas */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
    </div>
  );
}