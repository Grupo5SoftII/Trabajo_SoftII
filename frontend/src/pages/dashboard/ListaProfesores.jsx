import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Administrador.css";
import Header from "../../components/Header";

export default function ListaProfesores() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo de profesores
  const profesores = [
    { 
      id: 1, 
      nombre: "María González", 
      email: "maria.gonzalez@escuela.edu", 
      clases: 5, 
      estado: "Activo",
      ultimaConexion: "Hoy, 10:30 AM"
    },
    { 
      id: 2, 
      nombre: "Carlos Rodríguez", 
      email: "carlos.rodriguez@escuela.edu", 
      clases: 3, 
      estado: "Activo",
      ultimaConexion: "Hoy, 09:15 AM"
    },
    { 
      id: 3, 
      nombre: "Ana Martínez", 
      email: "ana.martinez@escuela.edu", 
      clases: 4, 
      estado: "Inactivo",
      ultimaConexion: "Ayer, 04:20 PM"
    },
    { 
      id: 4, 
      nombre: "Luis Fernández", 
      email: "luis.fernandez@escuela.edu", 
      clases: 6, 
      estado: "Activo",
      ultimaConexion: "Hoy, 08:45 AM"
    },
    { 
      id: 5, 
      nombre: "Carmen López", 
      email: "carmen.lopez@escuela.edu", 
      clases: 2, 
      estado: "Activo",
      ultimaConexion: "Hoy, 11:00 AM"
    },
  ];

  const handleBack = () => {
    navigate("/admin");
  };

  // Filtrar profesores por nombre o email
  const filteredProfesores = profesores.filter(
    (profesor) =>
      profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ListaProfesores">
      <Header
        title="Lista de Profesores"
        leftButton={{ label: "← Volver", onClick: handleBack }}
        rightButton={{ label: "Cerrar sesión", onClick: () => navigate("/") }}
      />

      <div className="layout d-flex">
        <main className="base p-4">
          <div className="container">
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>Profesores Registrados</h3>
                  <span className="badge bg-primary fs-6">
                    Total: {profesores.length}
                  </span>
                </div>
                
                {/* Barra de búsqueda */}
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tabla de profesores */}
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-hover table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Clases Activas</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Última Conexión</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfesores.length > 0 ? (
                        filteredProfesores.map((profesor) => (
                          <tr key={profesor.id}>
                            <th scope="row">{profesor.id}</th>
                            <td>{profesor.nombre}</td>
                            <td>{profesor.email}</td>
                            <td className="text-center">{profesor.clases}</td>
                            <td>
                              <span
                                className={`badge ${
                                  profesor.estado === "Activo"
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {profesor.estado}
                              </span>
                            </td>
                            <td>{profesor.ultimaConexion}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => alert(`Ver detalles de ${profesor.nombre}`)}
                              >
                                Ver
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => alert(`Editar ${profesor.nombre}`)}
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">
                            No se encontraron profesores
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
