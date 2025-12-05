'use client';

import { useState } from 'react';
import { useLevels } from '@/hooks/useLevels';
import { LevelCard } from '@/components/levels/level-card';
import { LevelSkeleton } from '@/components/levels/level-skeleton';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Fallback data for demo purposes when backend is not connected
const fallbackLevels = [
  {
    id: 1,
    databaseId: 1,
    title: "Nivel A1 - Principiante",
    slug: "nivel-a1",
    infoNivel: {
      codigoVisual: "A1",
      duracion: "4 Meses",
      precio: 2500,
      descripcion: "Fundamentos básicos del inglés para comunicación diaria y expresiones frecuentes.",
      linkPago: "#",
      imagenLibro: { sourceUrl: "", altText: "Libro A1" }
    },
    dificultad: { nodes: [{ name: "Principiante", slug: "principiante" }] }
  },
  {
    id: 2,
    databaseId: 2,
    title: "Nivel A2 - Básico",
    slug: "nivel-a2",
    infoNivel: {
      codigoVisual: "A2",
      duracion: "4 Meses",
      precio: 2800,
      descripcion: "Comprende frases y expresiones de uso frecuente relacionadas con áreas de experiencia.",
      linkPago: "#",
      imagenLibro: { sourceUrl: "", altText: "Libro A2" }
    },
    dificultad: { nodes: [{ name: "Principiante", slug: "principiante" }] }
  },
  {
    id: 3,
    databaseId: 3,
    title: "Nivel B1 - Intermedio",
    slug: "nivel-b1",
    infoNivel: {
      codigoVisual: "B1",
      duracion: "6 Meses",
      precio: 3200,
      descripcion: "Lidia con la mayor parte de las situaciones que pueden surgir durante un viaje.",
      linkPago: "#",
      imagenLibro: { sourceUrl: "", altText: "Libro B1" }
    },
    dificultad: { nodes: [{ name: "Intermedio", slug: "intermedio" }] }
  },
  {
    id: 4,
    databaseId: 4,
    title: "Nivel B2 - Avanzado",
    slug: "nivel-b2",
    infoNivel: {
      codigoVisual: "B2",
      duracion: "6 Meses",
      precio: 3800,
      descripcion: "Relaciónate con hablantes nativos con un grado suficiente de fluidez y naturalidad.",
      linkPago: "#",
      imagenLibro: { sourceUrl: "", altText: "Libro B2" }
    },
    dificultad: { nodes: [{ name: "Avanzado", slug: "avanzado" }] }
  }
];

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function LevelsRoadmap() {
  const [activeFilter, setActiveFilter] = useState<LevelFilter>('all');
  const { data: levels, isLoading, error, refetch } = useLevels();

  // Use backend data if available, otherwise use fallback
  const displayLevels = (levels && levels.length > 0) ? levels : fallbackLevels;
  // If real error (not just empty), we might want to show error state, but for this demo
  // we gracefully degrade to fallback data if connection fails, but show an alert.
  const isUsingFallback = !!error || !levels;

  // Filter levels based on active filter
  const filteredLevels = displayLevels.filter(level => {
    if (activeFilter === 'all') return true;

    // Check taxonomy first, then fallback to visual code
    const difficultySlug = level.dificultad?.nodes?.[0]?.slug;
    const visualCode = level.infoNivel.codigoVisual;

    switch (activeFilter) {
      case 'beginner':
        return difficultySlug === 'principiante' || visualCode.startsWith('A');
      case 'intermediate':
        return difficultySlug === 'intermedio' || visualCode.startsWith('B');
      case 'advanced':
        return difficultySlug === 'avanzado' || visualCode.startsWith('C');
      default:
        return true;
    }
  });

  return (
    <section id="niveles" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            TU CAMINO A LA FLUIDEZ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comienza en tu nivel actual y avanza hasta dominar el inglés
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            className="flex items-center gap-2 rounded-full"
          >
            <Filter className="h-4 w-4" />
            Todos los Niveles
          </Button>
          <Button
            variant={activeFilter === 'beginner' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('beginner')}
            className="rounded-full"
          >
            Principiante (A1-A2)
          </Button>
          <Button
            variant={activeFilter === 'intermediate' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('intermediate')}
            className="rounded-full"
          >
            Intermedio (B1-B2)
          </Button>
          <Button
            variant={activeFilter === 'advanced' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('advanced')}
            className="rounded-full"
          >
            Avanzado (C1-C2)
          </Button>
        </div>

        {/* Connection Error Alert (only if error) */}
        {error && (
           <div className="max-w-2xl mx-auto mb-8">
             <Alert variant="destructive">
               <AlertDescription className="flex items-center justify-between">
                 <span>No se pudo conectar con el servidor. Mostrando datos de ejemplo.</span>
                 <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4 bg-white text-destructive border-destructive hover:bg-red-50">
                   Reintentar
                 </Button>
               </AlertDescription>
             </Alert>
           </div>
        )}

        {/* Levels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <LevelSkeleton key={i} />
            ))}
          </div>
        ) : filteredLevels && filteredLevels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredLevels.map((level) => (
              <LevelCard key={level.id} level={level as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron niveles con los filtros seleccionados.
            </p>
          </div>
        )}

        {/* Stats */}
        {!isLoading && filteredLevels && filteredLevels.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {filteredLevels.length}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Niveles Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Math.min(...filteredLevels.map(l => l.infoNivel.precio)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Precio Desde (RD$)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Meses Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Satisfacción</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
