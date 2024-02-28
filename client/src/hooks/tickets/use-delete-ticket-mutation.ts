import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';

import { ticketsKeys } from './tickets-keys';

export function useDeleteTicketMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`tickets/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
    },
  });
}
