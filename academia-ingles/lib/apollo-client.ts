import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// HTTP Link configuration
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
  credentials: 'same-origin',
  headers: {
    'Apollo-Require-Preflight': 'true',
    'Content-Type': 'application/json',
  },
  fetchOptions: {
    mode: 'cors',
  },
});

// Error Link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );

      // Log to Sentry or other monitoring service
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Sentry.captureException(new Error(`GraphQL Error: ${message}`));
      }

      // Handle specific error codes
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Handle authentication errors
        console.log('User authentication required');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle specific network errors
    if ('statusCode' in networkError) {
      switch ((networkError as any).statusCode) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Rate limit exceeded');
          // Implement exponential backoff
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          console.error('Server error');
          break;
      }
    }
  }
});

// Retry Link with exponential backoff
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error) => {
      // Retry on network errors, but not on GraphQL errors
      return !!error && !('graphQLErrors' in error);
    },
  },
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        niveles: {
          keyArgs: false,
          merge(existing = [], incoming: any[], { args }) {
            if (!args || !args.after) {
              return incoming;
            }
            return [...existing, ...incoming];
          },
        },
        posts: {
          keyArgs: ['where'],
          merge(existing = [], incoming: any[]) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Nivel: {
      keyFields: ['databaseId'],
    },
    Post: {
      keyFields: ['databaseId'],
    },
  },
});

// Create Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to clear cache
export const clearApolloCache = () => {
  client.cache.reset();
};

// Helper function to refetch queries
export const refetchQueries = (queryNames: string[]) => {
  queryNames.forEach(queryName => {
    client.refetchQueries({
      include: [queryName],
    });
  });
};
