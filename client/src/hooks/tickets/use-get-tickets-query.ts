import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Ticket } from '@/models/tickets/ticket';

import { ticketsKeys } from './tickets-keys';

export type UseGetTicketsQueryParams = {
  skip: number;
  limit: number;
  query?: string;
  ticketCategories?: string[];
  statuses?: string[];
  sort?: 'title' | '-title' | 'dueDate' | '-dueDate';
};

export function useGetTicketsQuery(params: UseGetTicketsQueryParams) {
  return useQuery({
    queryFn: async (): Promise<{
      totalCount: { count: number };
      results: Ticket[];
    }> => {
      const searchParams = new URLSearchParams();

      searchParams.set('skip', params.skip.toString());
      searchParams.set('limit', params.limit.toString());

      if (params.sort) searchParams.set('sort', params.sort);
      if (params.query) searchParams.set('query', params.query);
      if (params.statuses)
        searchParams.set('statuses', params.statuses.join(','));
      if (params.ticketCategories)
        searchParams.set('ticketCategories', params.ticketCategories.join(','));

      const response = await api.get(`tickets?${searchParams.toString()}`);
      return response.data;
    },
    queryKey: ticketsKeys.list(params),
    staleTime: 0,
  });
}
