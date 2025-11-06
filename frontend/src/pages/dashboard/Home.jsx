import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RadialQuickChat from "../../components/RadialQuickChat";
import SubmenuGrid from "../../components/SubmenuGrid";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [puntos, setPuntos] = useState(0);
  const [roomNumber, setRoomNumber] = useState("");

  // Centro del menú y radios base
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [radii, setRadii] = useState({ inner: 90, outer: 180 });

  // Modo: centrado o acoplado (dock)
  const [mode, setMode] = useState("center"); // 'center' | 'docked'
  const [selectedCat, setSelectedCat] = useState(null);

  // Búsqueda libre
  const [searchTerm, setSearchTerm] = useState(null);

  // Catálogo de submenús (por ahora no lo usamos para la API, lo dejamos)
  const submenus = {
    Emociones: ["Feliz", "Triste", "Molesto", "Calmo", "Ansioso", "Sorprendido"],
    Preguntas: ["¿Qué pasó?", "¿Cómo te sientes?", "¿Necesitas ayuda?", "¿Quién?", "¿Dónde?", "¿Cuándo?"],
    Acciones:  ["Respirar", "Pausar", "Pedir apoyo", "Escuchar", "Anotar", "Organizar"],
    Personas:  ["Amigo", "Profesor", "Familia", "Compañero", "Tutor", "Coach"],
    Descriptores: ["Rápido", "Lento", "Difícil", "Fácil", "Ruidoso", "Claro"],
    Necesidades:  ["Agua", "Descanso", "Espacio", "Tiempo", "Ayuda", "Información"],
  };

  // Zonas seguras (barra inferior, botón ayuda, etc.)
  const SAFE = { margin: 24, bottomBar: 72, helpBtn: 72, gap: 12 };

  // Radios responsivos
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const scale = 1.2;
      const outer = Math.max(150, Math.min(240, Math.floor(w * 0.22 * scale)));
      const inner = Math.floor(outer * 0.5);
      setRadii({ inner, outer });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Posicionamiento del menú: centro o acoplado abajo-derecha
  useEffect(() => {
    const recalcPosition = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const isDocked = mode === "docked";
      const dockOuter = Math.round(radii.outer * 0.75);
      const useOuter = isDocked ? dockOuter : radii.outer;

      if (isDocked) {
        const rightSafe = SAFE.margin + SAFE.helpBtn + SAFE.gap;
        const bottomSafe = SAFE.margin + SAFE.bottomBar + SAFE.gap;
        setCenter({
          x: w - rightSafe - useOuter,
          y: h - bottomSafe - useOuter,
        });
      } else {
        setCenter({ x: Math.round(w / 2), y: Math.round(h / 2) });
      }
    };

    recalcPosition();
    window.addEventListener("resize", recalcPosition);
    return () => window.removeEventListener("resize", recalcPosition);
  }, [mode, radii]);

  const handleCenter = () => {
    console.log("Quick Chat");
  };

  const handlePickSub = (val) => {
    console.log(`Elegiste ${selectedCat || searchTerm} → ${val}`);
    setPuntos((p) => p + 1);
  };

  // Buscar desde la barra
  const handleSearch = (term) => {
    setSearchTerm(term);
    setSelectedCat(null);  // opcional: limpiar categoría
    setMode("docked");
  };

  const undock = () => {
    setMode("center");
    setSelectedCat(null);
    setSearchTerm(null);
  };

  // Estado actual del menú (centrado/acoplado) y radios efectivos
  const isDocked = mode === "docked";
  const menuOuter = isDocked ? Math.round(radii.outer * 0.75) : radii.outer;
  const menuInner = Math.round(menuOuter * 0.5);

  // ===== Barra de búsqueda debajo del radial (sin superponer) =====
  const BAR_H = 46;          // alto aprox. de la barra
  const EXTRA_GAP = 40;      // espacio extra bajo la rueda
  const maxTop = window.innerHeight - (SAFE.bottomBar + BAR_H + SAFE.gap);

  const searchBarStyle =
    mode === "center"
      ? {
          position: "fixed",
          left: center.x,
          top: Math.min(maxTop, center.y + menuOuter + EXTRA_GAP),
          transform: "translateX(-50%)",
          zIndex: 10000,
        }
      : {
          position: "fixed",
          right: SAFE.margin,
          bottom: SAFE.margin,
          zIndex: 10000,
        };

  return (
    <div className="layout">
      {/* Header global (de tu carpeta components) */}
      <Header puntos={puntos} />

      {/* Menú radial (solo cuando no hay panel abierto) */}
      {!selectedCat && !searchTerm && (
        <RadialQuickChat
          centerX={center.x}
          centerY={center.y}
          innerRadius={menuInner}
          outerRadius={menuOuter}
          onItem={(cat) => { setSelectedCat(cat); setMode("docked"); setPuntos((p) => p + 1); }}
          onCenter={handleCenter}
        />
      )}

      {/* Panel centrado: por categoría o por búsqueda */}
      {isDocked && (selectedCat || searchTerm) && (
        <SubmenuGrid
          anchor="center"
          title={selectedCat || `Resultados: ${searchTerm}`}
          remoteTerm={searchTerm || selectedCat}
          lang="es"
          onPick={handlePickSub}
          onClose={undock}
        />
      )}

      {/* Botón volver al centro */}
      {isDocked && (
        <button className="undock-btn" onClick={undock} aria-label="Volver al centro">
          Volver al centro
        </button>
      )}

      {/* Barra de búsqueda debajo del radial */}
      <SearchBar onSearch={handleSearch} style={searchBarStyle} />

      {/* Room Creation Form */}
      <div className="room-creation" style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter 4-digit room number"
            value={roomNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setRoomNumber(value);
            }}
            pattern="[0-9]{4}"
            maxLength="4"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (roomNumber.length === 4) {
                navigate(`/room/${roomNumber}`);
              }
            }}
            disabled={roomNumber.length !== 4}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
