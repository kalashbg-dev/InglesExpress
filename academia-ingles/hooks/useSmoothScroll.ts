'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useSmoothScroll() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Esperar a que el DOM esté completamente cargado
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Esperar un frame para asegurar que el DOM esté listo
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 100);
      }
    };

    // Ejecutar inmediatamente
    handleHashChange();

    // También manejar cambios en la URL
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname, searchParams]);
}
