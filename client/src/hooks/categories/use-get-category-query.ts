import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';

import { categoriesKeys } from './categories-keys';

export function useGetCategoryQuery(id: string | null) {
  return useQuery({
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get(`categories/${id}`);
      return response.data;
    },
    queryKey: categoriesKeys.detail(id),
  });
}
