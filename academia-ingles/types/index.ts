// WordPress Image Type
export interface WordPressImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
}

// Level ACF Fields
export interface LevelACF {
  codigoVisual: string;
  duracion: string;
  precio: number;
  descripcion?: string;
  linkPago: string;
  imagenLibro: WordPressImage;
}

// Level Type
export interface Level {
  id: number;
  databaseId: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: {
    node: WordPressImage;
  };
  infoNivel: LevelACF;
  dificultad?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
}

// FAQ Type
export interface FAQ {
  id: number;
  databaseId: number;
  title: string;
  content: string;
  excerpt?: string;
  infoFAQ?: {
    categoria: 'académico' | 'administrativo';
  };
}

// Site Settings
export interface SiteSettings {
  title: string;
  description: string;
  language: string;
  timezone: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

// Pagination
export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// Filter Params
export interface LevelFilterParams {
  search?: string;
  dificultad?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
}
