import React from "react";
import "./PictogramCard.css";

export default function PictogramCard({
  title,
  src,
  onClick = () => {},
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);

  return (
    <button className="picto-card" onClick={onClick} title={title} aria-label={`Seleccionar ${title}`}>
      <figure className="picto-figure">
        <div className={`picto-media ${loaded ? "is-loaded" : ""} ${errored ? "is-error" : ""}`}>
          {!loaded && !errored && <div className="picto-skeleton" />}
          {!errored && (
            <img
              src={src}
              alt={title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
            />
          )}
          {errored && <div className="picto-fallback">?</div>}
        </div>
        <figcaption className="picto-caption">{title}</figcaption>
      </figure>
    </button>
  );
}
