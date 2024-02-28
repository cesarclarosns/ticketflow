import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Category } from '@/models/categories/category';
import { type Ticket } from '@/models/tickets/ticket';

import { categoriesKeys } from './categories-keys';

export type UseGetCategoriesQueryParams = {
  skip?: number;
  limit?: number;
  sort?: 'categoryName' | '-categoryName';
};

export function useGetCategoriesQuery(params: UseGetCategoriesQueryParams) {
  return useQuery({
    queryFn: async (): Promise<Category[]> => {
      const searchParams = new URLSearchParams();

      if (params.skip) searchParams.set('skip', params.skip.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.sort) searchParams.set('query', params.sort);

      const response = await api.get(`categories?${searchParams.toString()}`);
      return response.data;
    },
    queryKey: categoriesKeys.list(params),
  });
}
