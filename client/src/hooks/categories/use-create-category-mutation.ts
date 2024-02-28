import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Category } from '@/models/categories/category';
import { type CreateCategory } from '@/schemas/categories/create-category';

import { categoriesKeys } from './categories-keys';

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategory): Promise<Category> => {
      const response = await api.post('categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}
