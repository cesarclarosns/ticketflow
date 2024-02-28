import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type UpdateTicket } from '@/schemas/tickets/update-ticket';

import { categoriesKeys } from '../categories/categories-keys';

export function useUpdateTicketMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTicket) => {
      const response = await api.patch(`tickets/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.detail(id) });
    },
  });
}
