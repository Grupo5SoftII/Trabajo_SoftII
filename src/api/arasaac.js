const API_BASE = 'https://api.arasaac.org/api'; // base pública
// Buscar pictos por idioma + término
const SEARCH_URL = (lang, term) => `${API_BASE}/pictograms/${lang}/search/${encodeURIComponent(term)}`;

const STATIC_PNG = (id, size = 500) =>
  `https://static.arasaac.org/pictograms/${id}/${id}_${size}.png`;

// SVG directo (algunas instalaciones lo sirven así; si no, coméntalo)
const SVG_URL = (lang, id) => `${API_BASE}/pictograms/${lang}/${id}?download=false`;

export async function searchPictos({ lang = 'es', term }) {
  if (!term) return [];
  const res = await fetch(SEARCH_URL(lang, term));
  if (!res.ok) throw new Error(`ARASAAC ${res.status}`);
  const json = await res.json();
  
  return json.map((p) => ({
    id: p._id ?? p.id ?? p.identifier,
    keywords: p.keywords?.map(k => k.keyword) ?? [],
  })).filter(p => p.id);
}

export function pictoImageUrl(id, opts = { size: 500, prefer: 'png', lang: 'es' }) {
  const { size = 500, prefer = 'png', lang = 'es' } = opts;
  if (prefer === 'svg') return SVG_URL(lang, id);  
  return STATIC_PNG(id, size);
}
