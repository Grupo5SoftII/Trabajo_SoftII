// src/components/SubmenuGrid.jsx
import React from "react";
import "./SubmenuGrid.css";
import useArasaacSearch from "../hooks/useArasaacSearch";
import { pictoImageUrl } from "../api/arasaac";

export default function SubmenuGrid({
  title,
  items = [],              // por si quieres mezclar local + remoto
  remoteTerm = null,       // ← NUEVO: si viene, se ignora 'items' y se busca en ARASAAC
  lang = 'es',
  onPick = () => {},
  anchor = "center",
  bottomOffset = 220,
  centerX = null,
  onClose = () => {},
}) {
  const overlayStyle =
    anchor === "center" ? {} : { bottom: bottomOffset, left: centerX };
  const overlayClass =
    anchor === "center" ? "submenu-overlay overlay-center" : "submenu-overlay overlay-dock";

  const { data, loading, error } = useArasaacSearch(remoteTerm, lang);
  const list = remoteTerm ? data : items.map((t, i) => ({ id: `local-${i}`, label: t }));

  return (
    <div className={`${overlayClass} is-open`} style={overlayStyle} onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="submenu-panel">
        <div className="submenu-grid-header">{title}</div>

        {loading && <div className="grid-status">Buscando pictogramas…</div>}
        {error && <div className="grid-status error">Error cargando ARASAAC: {String(error.message ?? error)}</div>}

        <div className="submenu-grid-tiles">
          {list.map((item) => {
            const id   = item.id;
            const name = item.label ?? item.keywords?.[0] ?? id;
            const src  = remoteTerm ? pictoImageUrl(id, { size: 500, prefer: 'png', lang }) : null;

            return (
              <button
                key={id}
                className="submenu-tile"
                aria-label={`Seleccionar ${name}`}
                onClick={() => onPick(name)}
                title={name}
              >
                <div className="tile-art">
                  {remoteTerm && src && (
                    <img
                      src={src}
                      alt={name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  )}
                </div>
                <div className="tile-label">{name}</div>
              </button>
            );
          })}
        </div>

        <div className="license-note">
          Pictogramas © ARASAAC – Gobierno de Aragón (autor: Sergio Palao). CC BY-NC-SA.
        </div>
      </div>
    </div>
  );
}
