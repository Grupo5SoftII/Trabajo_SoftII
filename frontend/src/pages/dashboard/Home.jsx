import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadialQuickChat from "../../components/RadialQuickChat";
import SubmenuGrid from "../../components/SubmenuGrid";
import SearchBar from "../../components/SearchBar";
import { useRadialWindow } from "../../hooks/useRadialWindow";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [selectedCat, setSelectedCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  const mode = (selectedCat || searchTerm) ? "docked" : "center";
  const { center, radii } = useRadialWindow(mode);

  const menuOuter = mode === "docked" ? Math.round(radii.outer * 0.75) : radii.outer;
  const menuInner = Math.round(menuOuter * 0.5);

  const handleCenterClick = () => console.log("Quick Chat");
  const handleItemSelect = (cat) => setSelectedCat(cat);
  const handleSearch = (term) => { setSearchTerm(term); setSelectedCat(null); };
  const handleUndock = () => { setSelectedCat(null); setSearchTerm(null); };
  const handlePickSubItem = (val) => console.log(`Elegiste: ${val}`);

  const handleLogout = () => console.log("Cerrando sesión...");
  const handleEmergency = () => console.log("🚨 EMERGENCIA 🚨");

  return (
    <div className="layout">
      
      {/* --- 1. BANNER SUPERIOR (NUEVO) --- */}
      <div className="top-banner"></div>

      {/* --- ELEMENTOS FLOTANTES --- */}
      <div className="user-image-placeholder">
        <span>*Imagen*</span>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>

      <button className="emergency-btn" onClick={handleEmergency}>
        Botón de<br/>emergencia
      </button>
      
      {/* --- MENÚ RADIAL --- */}
      {mode === "center" && (
        <RadialQuickChat
          centerX={center.x}
          centerY={center.y}
          innerRadius={menuInner}
          outerRadius={menuOuter}
          onItem={handleItemSelect}
          onCenter={handleCenterClick}
        />
      )}

      {/* --- GRID DE RESULTADOS --- */}
      {mode === "docked" && (
        <>
          <SubmenuGrid
            anchor="center"
            title={selectedCat || `Resultados: ${searchTerm}`}
            remoteTerm={searchTerm || selectedCat}
            lang="es"
            onPick={handlePickSubItem}
            onClose={handleUndock}
          />
        </>
      )}

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className={`search-container ${mode}`}>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
}