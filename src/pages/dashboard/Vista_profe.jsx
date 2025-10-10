import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Vista_profe.css";

export default function Vista_profe() {
  const [menuOpen, setmenuOpen] = useState(true);

  const items = [
    { id: 1, nombre: "Kennett", img: "", pictograma: "🔥" },
    { id: 2, nombre: "Alvaro A", img: "", pictograma: "🔥" },
    { id: 3, nombre: "Alvaro E", img: "", pictograma: "😊" },
    { id: 4, nombre: "Walter", img: "", pictograma: "⭐" },
    { id: 5, nombre: "Gabriel", img: "", pictograma: "👏" },
    { id: 6, nombre: "Renato", img: "", pictograma: "💡" },
    { id: 7, nombre: "Micaela", img: "", pictograma: "👏" },
    { id: 8, nombre: "Sebastian", img: "", pictograma: "💡" },
  ];

  return (
    <div className="Vista_profe">
      <header className="header d-flex align-items-center px-3">
        <button
          className="btn btn-outline-light me-3"
          onClick={() => setmenuOpen((v) => !v)}
          aria-label={menuOpen ? "Ocultar chats" : "Mostar chats"}
        >
          {menuOpen ? "Ocultar chats" : "Mostrar chats"}
        </button>

        <h1 className="m-0 text-white">Clase</h1>
      </header>

      <div className="layout d-flex">
        <aside className={`menu bg-light ${menuOpen ? "open" : "closed"}`}>
          <nav className="p-3">
            <h5 className="fw-bold mb-3">Alumnos</h5>
            <ul className="list-unstyled">
              {items.map((item) => (
                <li key={item.id} className="mb-2">
                  <button
                    className="btn btn-outline-primary w-100 text-start"
                    style={{ borderRadius: "8px" }}
                  >
                    {item.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="base p-4">
          <div className="container-fluid">
            <div className="row g-3">
              {items.map((item) => (
                <div key={item.id} className="col-6 col-sm-4 col-md-3">
                  <div className="usuario position-relative text-center">
                    <div className="pictograma" aria-hidden>
                      {item.pictograma}
                    </div>

                    <img
                      src={item.img}
                      className="rounded-circle mx-auto d-block f-perfil"  
                    />

                    <div className="nombre mt-2">{item.nombre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
