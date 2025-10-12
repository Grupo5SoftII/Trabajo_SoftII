import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ placeholder = "Buscar pictograma…", onSearch = () => {}, style = {} }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) onSearch(term);
  };

  return (
    <form className="quick-search" onSubmit={submit} style={style}>
      <input
        className="quick-search-input"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar pictograma"
      />
      <button className="quick-search-btn" type="submit">Buscar</button>
    </form>
  );
}
