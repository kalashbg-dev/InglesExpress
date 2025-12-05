'use client';

import { useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { FAQ } from '@/types';
import { validateFAQs } from '@/lib/validation';

const GET_FAQS_QUERY = gql`
  query GetFAQsForHook {
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

const fetchFAQs = async (): Promise<FAQ[]> => {
  try {
    const { data } = await client.query({
      query: GET_FAQS_QUERY,
      fetchPolicy: 'network-only',
    });

    if (!data?.posts?.nodes) {
      throw new Error('No FAQs data received');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedFAQs = data.posts.nodes.map((node: any) => ({
      id: node.databaseId,
      databaseId: node.databaseId,
      title: node.title,
      content: node.content,
      excerpt: node.excerpt || '',
      infoFAQ: {
        categoria: node.infoFAQ?.categoria || 'academic', // default fallback
      },
    }));

    return validateFAQs(transformedFAQs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const useFAQs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFAQs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
