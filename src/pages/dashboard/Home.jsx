import React, { useEffect, useState } from "react";
import RadialQuickChat from "../../components/RadialQuickChat";
import SubmenuGrid from "../../components/SubmenuGrid";
import "./Home.css";

export default function Home() {
  const [puntos, setPuntos] = useState(0);

  // Centro del menú y radios base
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [radii, setRadii] = useState({ inner: 90, outer: 180 });

  // Modo: centrado o acoplado (dock)
  const [mode, setMode] = useState("center"); // 'center' | 'docked'
  const [selectedCat, setSelectedCat] = useState(null);

  // Catálogo de submenús (placeholders por ahora)
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
      const scale = 1.2; // súbelo si quieres la rueda más grande
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
    console.log(`Elegiste ${selectedCat} → ${val}`);
    setPuntos((p) => p + 1);
  };

  const undock = () => {
    setMode("center");
    setSelectedCat(null);
  };

  // Estado actual del menú (centrado/acoplado) y radios efectivos
  const isDocked = mode === "docked";
  const menuOuter = isDocked ? Math.round(radii.outer * 0.75) : radii.outer;
  const menuInner = Math.round(menuOuter * 0.5);

  // --- Offsets del grid: NO se superpone y queda centrado sobre la rueda ---
  const h = window.innerHeight;
  const w = window.innerWidth;

  // Borde superior de la rueda (cuando está acoplada)
  const wheelTop = center.y - menuOuter;
  // Distancia de la rueda al borde derecho (por si quisieras usarla)
  const wheelRight = w - (center.x + menuOuter);

  // Altura: justo POR ENCIMA de la rueda, respetando barra inferior
  const gridBottomOffset = Math.max(
    h - wheelTop + SAFE.gap,      // por encima de la rueda
    SAFE.bottomBar + SAFE.gap     // respeta la barra A1–A5
  );

  // Ancho aproximado del grid en desktop (3 columnas)
  const TILE_W = 140, GAP = 12, COLS_DESKTOP = 3;
  const approxGridWidth = COLS_DESKTOP * TILE_W + (COLS_DESKTOP - 1) * GAP;

  // Centrar horizontalmente sobre el centro de la rueda,
  // evitando invadir botón de ayuda (derecha) y margen izquierdo.
  const rightSafeX = w - (SAFE.helpBtn + SAFE.gap) - approxGridWidth / 2;
  const leftSafeX = SAFE.margin + approxGridWidth / 2;

  const desiredCenterX = center.x;
  const clampedCenterX = Math.max(leftSafeX, Math.min(desiredCenterX, rightSafeX));

  return (
    <div className="layout">
      {/* Menú radial */}
      <RadialQuickChat
        centerX={center.x}
        centerY={center.y}
        innerRadius={menuInner}
        outerRadius={menuOuter}
        onItem={(cat) => { setSelectedCat(cat); setMode("docked"); setPuntos((p) => p + 1); }}
        onCenter={handleCenter}
      />

      {/* Grid de submenús (centrado sobre la rueda acoplada) }
      {isDocked && selectedCat && (
        <SubmenuGrid
          anchor="center"                 // ← ahora centrado en la pantalla
          title={selectedCat}
          items={submenus[selectedCat]}
          onPick={handlePickSub}
        />
      )}
      {/* Panel centrado con resultados de ARASAAC */}
      {isDocked && selectedCat && (
        <SubmenuGrid
          anchor="center"
          title={selectedCat}
          // term remoto que consultará la API (usa la propia categoría)
          remoteTerm={selectedCat}
          lang="es"
          onPick={handlePickSub}
          onClose={() => { setSelectedCat(null); setMode("center"); }}
        />
      )}



      {/* Botón volver al centro */}
      {isDocked && (
        <button className="undock-btn" onClick={undock} aria-label="Volver al centro">
          Volver al centro
        </button>
      )}
    </div>
  );
}
