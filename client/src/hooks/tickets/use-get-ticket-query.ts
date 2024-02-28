import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';

import { ticketsKeys } from './tickets-keys';

export function useGetTicketQuery(id: string) {
  return useQuery({
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    },
    queryKey: ticketsKeys.detail(id),
  });
}
