import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./imagen_alumno.css";

export default function Imagen_alumno() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTitle = location.state?.title || "Imagen del alumno";

  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const chicos = [1, 2, 3, 4].map((n) => `https://avatar.iran.liara.run/public/${n}`);
  const chicas = [51, 52, 53, 54].map((n) => `https://avatar.iran.liara.run/public/${n}`);

  const handleConfirm = () => {
    // For now just log and navigate back; caller can adapt to save the selection.
    console.log("Confirmar:", { name, selectedImage });
    // You can pass state back if desired, e.g. navigate(-1, { state: { name, selectedImage } })
    alert(`Nombre: ${name}\nImagen: ${selectedImage || "(ninguna)"}`);
  };

  return (
    <div className="ImagenAlumno">
      <header className="header d-flex align-items-center px-3">
        <button className="btn btn-outline-light me-3" aria-label="Menú">
          Menú
        </button>
        <h1 className="m-0 text-white">{defaultTitle}</h1>
        <button className="btn btn-outline-light ms-auto" onClick={() => navigate(-1)}>
          Volver
        </button>
      </header>

      <div className="layout d-flex">
        <aside className={`menu bg-light open`}>
          <nav className="p-3">
            <h5 className="fw-bold mb-3">Opciones</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100 text-start">Lista de alumnos</button>
              </li>
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100 text-start">Crear alumno</button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="base p-4">
          <div className="form-card">
            <h2 className="mb-4">Seleccionar imagen del alumno</h2>

            <div className="mb-4">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese nombre del alumno"
              />
            </div>

            <div className="mb-3">
              <h5>Chicos</h5>
              <table className="table table-borderless image-table">
                <tbody>
                  <tr>
                    {chicos.map((url) => (
                      <td key={url} className="image-cell text-center">
                        <img
                          src={url}
                          alt={url}
                          onClick={() => setSelectedImage(url)}
                          className={selectedImage === url ? "selected" : ""}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <h5>Chicas</h5>
              <table className="table table-borderless image-table">
                <tbody>
                  <tr>
                    {chicas.map((url) => (
                      <td key={url} className="image-cell text-center">
                        <img
                          src={url}
                          alt={url}
                          onClick={() => setSelectedImage(url)}
                          className={selectedImage === url ? "selected" : ""}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex mt-3">
              <button className="btn btn-primary btn-lg w-100" onClick={handleConfirm}>
                Confirmar
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
