'use client';

import { useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { Level } from '@/types';
import { validateLevels } from '@/lib/validation';
import { MOCK_LEVELS } from '@/lib/mock-data';

// GraphQL query
const GET_LEVELS_QUERY = gql`
  query GetLevelsForHook {
    niveles(first: 100) {
      nodes {
        databaseId
        title
        slug
        infoNivel {
          codigoVisual
          duracion
          precio
          descripcion
          linkPago
          imagenLibro {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        dificultad {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// Fetch function
const fetchLevels = async (): Promise<Level[]> => {
  // Check for Mock Mode
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    console.log('Using Mock Data for Levels');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_LEVELS;
  }

  try {
    const { data } = await client.query({
      query: GET_LEVELS_QUERY,
      fetchPolicy: 'network-only',
    });

    if (!data?.niveles?.nodes) {
      throw new Error('No levels data received');
    }

    // Transform WordPress data to our format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedLevels = data.niveles.nodes.map((node: any) => ({
      id: node.databaseId,
      databaseId: node.databaseId,
      title: node.title,
      slug: node.slug,
      infoNivel: {
        codigoVisual: node.infoNivel.codigoVisual,
        duracion: node.infoNivel.duracion,
        precio: node.infoNivel.precio,
        descripcion: node.infoNivel.descripcion || '',
        linkPago: node.infoNivel.linkPago,
        imagenLibro: {
          sourceUrl: node.infoNivel.imagenLibro?.sourceUrl || '',
          altText: node.infoNivel.imagenLibro?.altText || `Libro ${node.title}`,
          mediaDetails: node.infoNivel.imagenLibro?.mediaDetails,
        },
      },
      dificultad: node.dificultad,
    }));

    // Validate with Zod
    return validateLevels(transformedLevels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

// React Query hook
export const useLevels = () => {
  return useQuery({
    queryKey: ['levels'],
    queryFn: fetchLevels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Low retry for dev
    retryDelay: 1000,
  });
};

// Hook for single level
export const useLevel = (slug: string) => {
  return useQuery({
    queryKey: ['level', slug],
    queryFn: async () => {
      // Mock Data Support
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
         await new Promise(resolve => setTimeout(resolve, 500));
         const level = MOCK_LEVELS.find(l => l.slug === slug);
         if (!level) throw new Error('Level not found in mock data');
         return level;
      }

      const { data } = await client.query({
        query: gql`
          query GetLevel($slug: ID!) {
            nivel(id: $slug, idType: SLUG) {
              databaseId
              title
              slug
              content
              infoNivel {
                codigoVisual
                duracion
                precio
                descripcion
                linkPago
                imagenLibro {
                  sourceUrl
                  altText
                }
              }
            }
          }
        `,
        variables: { slug },
      });

      return data.nivel;
    },
    enabled: !!slug,
  });
};

// Hook for filtered levels
export const useFilteredLevels = (filters: {
  dificultad?: string[];
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery({
    queryKey: ['levels', 'filtered', filters],
    queryFn: () => fetchLevels().then(levels => {
      return levels.filter(level => {
        // Filter by difficulty
        if (filters.dificultad && filters.dificultad.length > 0) {
          const levelDifficulties = level.dificultad?.nodes.map(n => n.slug) || [];
          const hasMatchingDifficulty = filters.dificultad.some(diff =>
            levelDifficulties.includes(diff)
          );
          if (!hasMatchingDifficulty) return false;
        }

        // Filter by price
        if (filters.minPrice !== undefined && level.infoNivel.precio < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && level.infoNivel.precio > filters.maxPrice) {
          return false;
        }

        return true;
      });
    }),
  });
};
