import React, { useState, useEffect } from "react";
import PictogramCard from "./PictogramCard"; 

export default function PictoView({ term }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!term) return;

    // Buscamos en Arasaac
    fetch(`https://api.arasaac.org/api/pictograms/es/best/${term}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const id = data[0]._id;
          setImageUrl(`https://api.arasaac.org/api/pictograms/${id}?download=false`);
        }
      })
      .catch((err) => console.error("Error pictograma:", err))
      .finally(() => setLoading(false));
  }, [term]);

  if (loading) return <span style={{fontSize:'0.8rem', color:'#999'}}>Cargando imagen...</span>;

  // Si no hay imagen, texto grande
  if (!imageUrl) return <h3 style={{color: '#1368ce', textTransform: 'uppercase'}}>{term}</h3>;

  // Si hay imagen, mostramos la tarjeta
  return (
    <div style={{ width: '140px' }}>
      <PictogramCard 
        title={term} 
        src={imageUrl} 
      />
    </div>
  );
}