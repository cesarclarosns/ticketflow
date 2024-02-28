import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Ticket } from '@/models/tickets/ticket';
import { type CreateTicket } from '@/schemas/tickets/create-ticket';

import { ticketsKeys } from './tickets-keys';

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTicket): Promise<Ticket> => {
      const response = await api.post('tickets', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
    },
  });
}
