import SearchBar from "../../components/SearchBar"; 
import useArasaacSearch from "../../hooks/useArasaacSearch";
import PictogramCard from "../../components/PictogramCard";
import ChatPanel from "../../components/ChatPanel";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Vista_profe.css";

export default function Vista_profe({ Nombre_clase: Nombre_clase_prop, studentCount, socket }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setmenuOpen] = useState(true);
  const [openChat, setOpenChat] = useState(null);
  const [messagesById, setMessagesById] = useState({});
  const location = useLocation(); 
  const navigate = useNavigate();
  const Nombre_clase = Nombre_clase_prop || location.state?.Nombre_clase || "Clase sin nombre";

  const { data: pictos, loading: pictoLoading, error: pictoError } =
    useArasaacSearch(searchTerm, "es");

  const pictosRef = useRef(null);

  const scrollPictos = (dir = 'right') => {
    const el = pictosRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.7) || 200;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };


  useEffect(() => {
    if (openChat) {
      setMessagesById((prev) => {
        if (prev[openChat.id]) return prev;
          const initial = [
          ];
        return { ...prev, [openChat.id]: initial };
      });
    }
  }, [openChat]);

  const cerrar_clase = () => {
    navigate("/crear_clase");
  }

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
        <h1 className="m-0 text-white">{Nombre_clase} {typeof studentCount === 'number' ? `- Alumnos: ${studentCount}` : ''}</h1>
        <button className="btn btn-outline-light ms-auto" onClick={cerrar_clase}>
          Cerrar clase
        </button>
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
                    onClick={() => setOpenChat(item)}
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

          {openChat && (
            <div className="chat-panel" role="dialog" aria-label={`Chat con ${openChat.nombre}`}>
              <ChatPanel
                title={openChat.nombre}
                messages={messagesById[openChat.id] || []}
                onClose={() => setOpenChat(null)}
              />
              <div className="chat-footer p-3">
                <div className="chat-pictograms mb-2">
                  {pictoLoading && <div className="small">Buscando pictogramas…</div>}
                  {pictoError && <div className="small text-danger">Error cargando pictogramas</div>}
                  <div className="pictos-grid d-flex" ref={pictosRef}>
                    {(pictos || []).slice(0, 12).map((p) => {
                      const id = p.id;
                      const title = p.keywords?.[0] ?? id;
                      const src = `https://api.arasaac.org/api/pictograms/${id}?download=false`;
                      return (
                        <PictogramCard
                          key={id}
                          title={title}
                          src={src}
                          onClick={() => {
                            if (!openChat) return;
                            setMessagesById((prev) => {
                              const prevMsgs = prev[openChat.id] || [];
                              const next = [...prevMsgs, { id: Date.now(), sender: "teacher", type: "img", src }];
                              return { ...prev, [openChat.id]: next };
                            });
                          }}
                        />
                      );
                    })}
                    {!pictoLoading && (!pictos || pictos.length === 0) && (
                      <div className="small text-muted">Sin resultados</div>
                    )}
                  </div>
                  {(pictos && pictos.length > 3) && (
                    <>
                      <button className="pictogram-scroll-btn left" aria-hidden onClick={() => scrollPictos('left')}>{'‹'}</button>
                      <button className="pictogram-scroll-btn right" aria-hidden onClick={() => scrollPictos('right')}>{'›'}</button>
                    </>
                  )}
                </div>
                <div className="chat-search-bar mb-2">
                  <SearchBar
                    placeholder="Buscar pictograma…"
                    onSearch={(term) => {
                      setSearchTerm(term);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}