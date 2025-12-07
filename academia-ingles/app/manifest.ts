import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Academia de Inglés - Aprende en 4 Meses',
    short_name: 'Academia Inglés',
    description: 'Aprende inglés rápido y efectivo con nuestra metodología garantizada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E63946', // Rojo de la marca
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
