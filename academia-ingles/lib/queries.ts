import { gql } from '@apollo/client';

// Fragment for WordPress Image
export const MEDIA_ITEM_FRAGMENT = gql`
  fragment MediaItemFragment on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

// Fragment for Level ACF Fields
export const LEVEL_ACF_FRAGMENT = gql`
  fragment LevelAcfFragment on Nivel_InfoNivel {
    codigoVisual
    duracion
    precio
    descripcion
    linkPago
    imagenLibro {
      ...MediaItemFragment
    }
  }
  ${MEDIA_ITEM_FRAGMENT}
`;

// Fragment for Level
export const LEVEL_FRAGMENT = gql`
  fragment LevelFragment on Nivel {
    databaseId
    title
    slug
    content
    excerpt
    featuredImage {
      node {
        ...MediaItemFragment
      }
    }
    infoNivel {
      ...LevelAcfFragment
    }
    dificultad {
      nodes {
        name
        slug
      }
    }
  }
  ${MEDIA_ITEM_FRAGMENT}
  ${LEVEL_ACF_FRAGMENT}
`;

// Query to get all levels
export const GET_ALL_LEVELS = gql`
  query GetAllLevels(
    $first: Int = 100
    $after: String
    $where: RootQueryToNivelConnectionWhereArgs
  ) {
    niveles(first: $first, after: $after, where: $where) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...LevelFragment
      }
    }
  }
  ${LEVEL_FRAGMENT}
`;

// Query to get a single level by slug
export const GET_LEVEL_BY_SLUG = gql`
  query GetLevelBySlug($slug: ID!) {
    nivel(id: $slug, idType: SLUG) {
      ...LevelFragment
    }
  }
  ${LEVEL_FRAGMENT}
`;

// Query to get FAQs
export const GET_FAQS = gql`
  query GetFAQs($category: String) {
    posts(
      where: {
        categoryName: "FAQ"
        orderby: { field: DATE, order: DESC }
      }
      first: 100
    ) {
      nodes {
        databaseId
        title
        content
        excerpt
        infoFAQ {
          categoria
        }
      }
    }
  }
`;

// Query to get site settings
export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings {
    generalSettings {
      title
      description
      language
      timezone
    }
    menuItems(where: { location: PRIMARY }) {
      nodes {
        label
        url
        target
      }
    }
  }
`;

// Query to search levels
export const SEARCH_LEVELS = gql`
  query SearchLevels($search: String!) {
    niveles(where: { search: $search }, first: 10) {
      nodes {
        ...LevelFragment
      }
    }
  }
  ${LEVEL_FRAGMENT}
`;
