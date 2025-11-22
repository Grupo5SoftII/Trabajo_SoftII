import { useState, useEffect } from 'react';

export function useRadialWindow(mode = 'center') {
  const [layout, setLayout] = useState({
    center: { x: 0, y: 0 },
    radii: { inner: 90, outer: 180 }
  });

  useEffect(() => {
    const calculateLayout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const scale = 1.2;
      const outer = Math.max(150, Math.min(240, Math.floor(w * 0.22 * scale)));
      const inner = Math.floor(outer * 0.5);

      const SAFE = { margin: 24, bottomBar: 72, helpBtn: 72, gap: 12 };
      const dockOuter = Math.round(outer * 0.75);

      let x, y;
      
      if (mode === 'docked') {
        const rightSafe = SAFE.margin + SAFE.helpBtn + SAFE.gap;
        const bottomSafe = SAFE.margin + SAFE.bottomBar + SAFE.gap;
        x = w - rightSafe - dockOuter;
        y = h - bottomSafe - dockOuter;
      } else {
        // MODO CENTER
        x = Math.round(w / 2);
        
        // --- CAMBIO: BAJAR MÁS EL MENÚ ---
        // Lo ponemos un poco más abajo de la mitad exacta (52%)
        y = Math.round(h * 0.52); 
      }

      setLayout({
        center: { x, y },
        radii: { inner, outer }
      });
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [mode]);

  return layout;
}