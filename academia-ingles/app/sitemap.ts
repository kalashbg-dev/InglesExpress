import { MetadataRoute } from 'next';
import { client } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

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
  let nivelesLines: any[] = [];
  try {
    const { data } = await client.query({
      query: GET_ALL_SLUGS,
      fetchPolicy: 'no-cache' // Siempre datos frescos para sitemap
    });

    if (data?.niveles?.nodes) {
        nivelesLines = data.niveles.nodes.map((nivel: any) => ({
        url: `${baseUrl}/niveles/${nivel.slug}`,
        lastModified: new Date(nivel.modified),
        changeFrequency: 'weekly',
        priority: 0.8,
        }));
    }
  } catch (error) {
    console.error('Error generando sitemap:', error);
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
