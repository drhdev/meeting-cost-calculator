import { useEffect, useState } from 'react';

function readCompactFromSearch(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get('compact') === '1' || params.get('view') === 'compact';
}

export function useCompactMode(): boolean {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? readCompactFromSearch(window.location.search) : false,
  );

  useEffect(() => {
    const sync = () => setCompact(readCompactFromSearch(window.location.search));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return compact;
}
