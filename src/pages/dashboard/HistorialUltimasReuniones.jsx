import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Administrador.css";
import Header from "../../components/Header";

export default function HistorialUltimasReuniones() {
  const navigate = useNavigate();
  const [filtroFecha, setFiltroFecha] = useState("todas");

  // Datos de ejemplo de reuniones/clases
  const reuniones = [
    {
      id: 1,
      nombreClase: "Clase de Matemáticas",
      profesor: "María González",
      fecha: "2025-10-11",
      hora: "10:30 AM",
      duracion: "45 min",
      alumnos: 8,
      estado: "Finalizada",
    },
    {
      id: 2,
      nombreClase: "Clase de Lenguaje",
      profesor: "Carlos Rodríguez",
      fecha: "2025-10-11",
      hora: "09:15 AM",
      duracion: "60 min",
      alumnos: 6,
      estado: "Finalizada",
    },
    {
      id: 3,
      nombreClase: "Clase de Ciencias",
      profesor: "Ana Martínez",
      fecha: "2025-10-10",
      hora: "04:20 PM",
      duracion: "50 min",
      alumnos: 7,
      estado: "Finalizada",
    },
    {
      id: 4,
      nombreClase: "Clase de Arte",
      profesor: "Luis Fernández",
      fecha: "2025-10-10",
      hora: "08:45 AM",
      duracion: "40 min",
      alumnos: 5,
      estado: "Finalizada",
    },
    {
      id: 5,
      nombreClase: "Clase de Música",
      profesor: "Carmen López",
      fecha: "2025-10-09",
      hora: "11:00 AM",
      duracion: "35 min",
      alumnos: 9,
      estado: "Finalizada",
    },
    {
      id: 6,
      nombreClase: "Tutoría Individual",
      profesor: "María González",
      fecha: "2025-10-09",
      hora: "02:30 PM",
      duracion: "30 min",
      alumnos: 1,
      estado: "Finalizada",
    },
    {
      id: 7,
      nombreClase: "Clase de Educación Física",
      profesor: "Carlos Rodríguez",
      fecha: "2025-10-08",
      hora: "10:00 AM",
      duracion: "55 min",
      alumnos: 10,
      estado: "Finalizada",
    },
  ];

  const handleBack = () => {
    navigate("/admin");
  };

  // Filtrar reuniones por fecha
  const filteredReuniones = reuniones.filter((reunion) => {
    const hoy = new Date("2025-10-11");
    const fechaReunion = new Date(reunion.fecha);
    
    switch (filtroFecha) {
      case "hoy":
        return fechaReunion.toDateString() === hoy.toDateString();
      case "semana":
        const hace7dias = new Date(hoy);
        hace7dias.setDate(hoy.getDate() - 7);
        return fechaReunion >= hace7dias;
      case "mes":
        return (
          fechaReunion.getMonth() === hoy.getMonth() &&
          fechaReunion.getFullYear() === hoy.getFullYear()
        );
      default:
        return true;
    }
  });

  return (
    <div className="HistorialReuniones">
      <Header
        title="Historial de Reuniones"
        leftButton={{ label: "← Volver", onClick: handleBack }}
        rightButton={{ label: "Cerrar sesión", onClick: () => navigate("/") }}
      />

      <div className="layout d-flex">
        <main className="base p-4">
          <div className="container">
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>Últimas Clases y Reuniones</h3>
                  <span className="badge bg-success fs-6">
                    Total: {filteredReuniones.length}
                  </span>
                </div>

                {/* Filtros */}
                <div className="mb-4">
                  <div className="btn-group" role="group" aria-label="Filtros de fecha">
                    <button
                      type="button"
                      className={`btn ${
                        filtroFecha === "todas" ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setFiltroFecha("todas")}
                    >
                      Todas
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        filtroFecha === "hoy" ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setFiltroFecha("hoy")}
                    >
                      Hoy
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        filtroFecha === "semana" ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setFiltroFecha("semana")}
                    >
                      Última Semana
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        filtroFecha === "mes" ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setFiltroFecha("mes")}
                    >
                      Este Mes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de reuniones */}
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-hover table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre de la Clase</th>
                        <th scope="col">Profesor</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Duración</th>
                        <th scope="col">Alumnos</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReuniones.length > 0 ? (
                        filteredReuniones.map((reunion) => (
                          <tr key={reunion.id}>
                            <th scope="row">{reunion.id}</th>
                            <td>{reunion.nombreClase}</td>
                            <td>{reunion.profesor}</td>
                            <td>{new Date(reunion.fecha).toLocaleDateString("es-ES")}</td>
                            <td>{reunion.hora}</td>
                            <td>{reunion.duracion}</td>
                            <td className="text-center">{reunion.alumnos}</td>
                            <td>
                              <span className="badge bg-secondary">{reunion.estado}</span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() =>
                                  alert(`Ver detalles de: ${reunion.nombreClase}`)
                                }
                              >
                                Ver más
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center text-muted">
                            No se encontraron reuniones
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="row mt-4">
              <div className="col-12">
                <h5 className="mb-3">Estadísticas Rápidas</h5>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">Total de Clases</h6>
                    <h2 className="card-text text-primary">{filteredReuniones.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">Total de Alumnos</h6>
                    <h2 className="card-text text-success">
                      {filteredReuniones.reduce((sum, r) => sum + r.alumnos, 0)}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">Promedio por Clase</h6>
                    <h2 className="card-text text-info">
                      {filteredReuniones.length > 0
                        ? Math.round(
                            filteredReuniones.reduce((sum, r) => sum + r.alumnos, 0) /
                              filteredReuniones.length
                          )
                        : 0}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
