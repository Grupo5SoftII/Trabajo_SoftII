import React, { useEffect, useState } from "react";
import RadialQuickChat from "../../components/RadialQuickChat";
import "./Home.css";

export default function Home() {
  const [puntos, setPuntos] = useState(0);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  // Centro del viewport (se recalcula al redimensionar)
  useEffect(() => {
    const calc = () => {
      setCenter({
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2),
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const handleItem = (data) => {
    console.log("Seleccionaste:", data);
    setPuntos((p) => p + 1);
  };

  const handleCenter = () => {
    console.log("Quick Chat click");
  };

  return (
    <div className="layout">
      <div className="score">
        <span>Puntos: {puntos}</span>
        <span className="star">★</span>
      </div>

      <button className="side-arrow" aria-label="Anterior">◀</button>

      {/* el contenedor ya no es necesario para calcular el centro */}
      <div className="center-area" />

      <RadialQuickChat
        centerX={center.x}
        centerY={center.y}
        onItem={handleItem}
        onCenter={handleCenter}
      />

      <div className="bottom-bar">
        {["A1", "A2", "A3", "A4", "A5"].map((k) => (
          <button key={k} className="bottom-btn" onClick={() => console.log(k)}>
            {k}
          </button>
        ))}
      </div>

      <button className="help-btn" onClick={() => alert("Ayuda…")}>
        Botón de ayuda
      </button>
      <button className="close-btn" aria-label="Cerrar">✕</button>
    </div>
  );
}

