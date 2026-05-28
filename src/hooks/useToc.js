import { useState, useEffect } from 'react';

export function useToc(page) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Small delay so the page has rendered
    const id = setTimeout(() => {
      const els = document.querySelectorAll('.prose h2, .prose h3');
      const items = [];
      els.forEach(el => {
        if (!el.id) {
          el.id = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        items.push({ id: el.id, label: el.textContent, level: el.tagName === 'H2' ? 2 : 3 });
      });
      setHeadings(items);
    }, 80);
    return () => clearTimeout(id);
  }, [page]);

  return headings;
}
