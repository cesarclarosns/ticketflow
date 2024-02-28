import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';

import { categoriesKeys } from './categories-keys';

export function useDeleteCategoryMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}
