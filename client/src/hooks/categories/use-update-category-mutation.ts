import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type UpdateCategory } from '@/schemas/categories/update-category';

import { ticketsKeys } from '../tickets/tickets-keys';

export function useUpdateCategoryMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCategory) => {
      const response = await api.patch(`tickets/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(id) });
    },
  });
}
