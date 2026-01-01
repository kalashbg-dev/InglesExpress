import { MetadataRoute } from 'next';
import { client } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import { MOCK_LEVELS } from '@/lib/mock-data';

const GET_ALL_SLUGS = gql`
  query GetAllSlugs {
    niveles(first: 100) {
      nodes {
        slug
        modified
      }
    }
    posts(first: 100) {
      nodes {
        slug
        modified
      }
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://academiaingles.com';

  // Obtener datos dinámicos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nivelesLines: any[] = [];

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    // Generate sitemap from Mock Data
    nivelesLines = MOCK_LEVELS.map((nivel) => ({
      url: `${baseUrl}/niveles/${nivel.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } else {
    try {
      const { data } = await client.query({
        query: GET_ALL_SLUGS,
        fetchPolicy: 'no-cache' // Siempre datos frescos para sitemap
      });

      if (data?.niveles?.nodes) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nivelesLines = data.niveles.nodes.map((nivel: any) => ({
          url: `${baseUrl}/niveles/${nivel.slug}`,
          lastModified: new Date(nivel.modified),
          changeFrequency: 'weekly',
          priority: 0.8,
          }));
      }
    } catch (error) {
      console.error('Error generando sitemap:', error);
      // Don't fail the build, just return static routes if backend fails
    }
  }

  // Rutas estáticas
  const staticRoutes = [
    '',
    '/niveles',
    '/metodologia',
    '/contacto',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes, ...nivelesLines];
}
