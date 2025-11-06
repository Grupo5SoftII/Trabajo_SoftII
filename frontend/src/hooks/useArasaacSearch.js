import { useEffect, useState } from 'react';
import { searchPictos } from '../api/arasaac';

export default function useArasaacSearch(term, lang = 'es') {
  const [data, setData]   = useState([]);
  const [loading, setL]   = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!term) { setData([]); return; }
      setL(true); setError(null);
      try {
        const res = await searchPictos({ lang, term });
        if (alive) setData(res);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setL(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [term, lang]);

  return { data, loading, error };
}
