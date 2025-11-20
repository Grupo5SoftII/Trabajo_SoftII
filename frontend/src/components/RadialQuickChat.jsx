import React from "react";
import { Menu, MenuItem, SubMenu } from "@spaceymonk/react-radial-menu";

/*
export default function RadialQuickChat({
  centerX,
  centerY,
  onItem = () => {},
  onCenter = () => {},
}) {
  const handleItemClick = (e, idx, data) => {
    onItem(data);
  };
  const handleSubMenuClick = (e, idx, data) => {
    // opcional: abrir modal/lista para esa categoría
    onItem(data);
  };
  const handleDisplayClick = () => {
    onCenter();
  };

  return (
    <Menu
      centerX={centerX}
      centerY={centerY}
      innerRadius={90}
      outerRadius={180}
      show={true}                 
      animation={["fade", "scale"]}
      animationTimeout={160}
      drawBackground
    >
    */

  export default function RadialQuickChat({
  centerX,
  centerY,
  onItem = () => {},
  onCenter = () => {},
  innerRadius = 90,   
  outerRadius = 180,  
  }) {
    const handleItemClick = (e, idx, data) => {
    onItem(data);
    };
    const handleSubMenuClick = (e, idx, data) => {
      onItem(data);
    };
    const handleDisplayClick = () => {
      onCenter();
    };

    return (
    <Menu
      centerX={centerX}
      centerY={centerY}
      innerRadius={innerRadius}   
      outerRadius={outerRadius}   
      show={true}
      animation={["fade", "scale"]}
      animationTimeout={160}
      drawBackground
    >
      {/* secciones */}
      <SubMenu
        onDisplayClick={handleDisplayClick}
        onItemClick={handleSubMenuClick}
        itemView="Emociones"
        data="Emociones"
        displayPosition="bottom"
      >
        <MenuItem onItemClick={handleItemClick} data="Feliz">Feliz</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Triste">Triste</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Molesto">Molesto</MenuItem>
      </SubMenu>

      <SubMenu
        onDisplayClick={handleDisplayClick}
        onItemClick={handleSubMenuClick}
        itemView="Preguntas"
        data="Preguntas"
        displayPosition="bottom"
      >
        <MenuItem onItemClick={handleItemClick} data="¿Qué pasó?">¿Qué pasó?</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="¿Cómo te sientes?">¿Cómo te sientes?</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="¿Necesitas ayuda?">¿Necesitas ayuda?</MenuItem>
      </SubMenu>

      <SubMenu
        onDisplayClick={handleDisplayClick}
        onItemClick={handleSubMenuClick}
        itemView="Acciones"
        data="Acciones"
        displayPosition="bottom"
      >
        <MenuItem onItemClick={handleItemClick} data="Pedir apoyo">Pedir apoyo</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Respirar">Respirar</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Pausar">Pausar</MenuItem>
      </SubMenu>

      <SubMenu
        onDisplayClick={handleDisplayClick}
        onItemClick={handleSubMenuClick}
        itemView="Personas"
        data="Personas"
        displayPosition="bottom"
      >
        <MenuItem onItemClick={handleItemClick} data="Amigo">Amigo</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Profesor">Profesor</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Familia">Familia</MenuItem>
      </SubMenu>

      <SubMenu
        onDisplayClick={handleDisplayClick}
        onItemClick={handleSubMenuClick}
        itemView="Descripción"
        data="Descripción"
        displayPosition="bottom"
      >
        <MenuItem onItemClick={handleItemClick} data="Rápido">Rápido</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Lento">Lento</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Difícil">Difícil</MenuItem>
      </SubMenu>

      <SubMenu
        onDisplayClick={handleDisplayClick}
        onItemClick={handleSubMenuClick}
        itemView="Necesito"
        data="Necesito"
        displayPosition="bottom"
      >
        <MenuItem onItemClick={handleItemClick} data="Agua">Agua</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Descanso">Descanso</MenuItem>
        <MenuItem onItemClick={handleItemClick} data="Espacio">Espacio</MenuItem>
      </SubMenu>
    </Menu>
  );
}
