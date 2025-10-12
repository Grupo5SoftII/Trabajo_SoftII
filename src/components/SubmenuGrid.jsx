import React from "react";
import "./SubmenuGrid.css";
import useArasaacSearch from "../hooks/useArasaacSearch";
import { pictoImageUrl } from "../api/arasaac";
import PictogramCard from "./PictogramCard";

export default function SubmenuGrid({
  title,
  items = [],
  remoteTerm = null,
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

  // mostrar solo 6
  const limitedData = remoteTerm ? data.slice(0, 6) : items.slice(0, 6);
  const list = remoteTerm
    ? limitedData
    : limitedData.map((t, i) => ({ id: `local-${i}`, label: t }));

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`${overlayClass} is-open`} style={overlayStyle} onClick={handleOverlayClick}>
      <div className="submenu-panel">
        <div className="submenu-grid-header">{title}</div>

        {loading && <div className="grid-status">Buscando pictogramas…</div>}
        {error && (
          <div className="grid-status error">
            Error cargando ARASAAC: {String(error.message ?? error)}
          </div>
        )}

        {/* === AQUÍ USAMOS PictogramCard === */}
        <div className="submenu-grid-tiles">
          {list.map((item) => {
            const id   = item.id;
            const name = item.label ?? item.keywords?.[0] ?? id;
            const src  = remoteTerm ? pictoImageUrl(id, { size: 500, prefer: 'png', lang }) : null;

            return (
              <PictogramCard
                key={id}
                title={name}
                src={src}
                onClick={() => onPick(name)}
              />
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

