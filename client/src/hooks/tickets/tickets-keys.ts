import { type UseGetTicketsQueryParams } from './use-get-tickets-query';

export const ticketsKeys = {
  all: () => ['tickets'] as const,
  detail: (id: string | null) => [...ticketsKeys.details(), id] as const,
  details: () => [...ticketsKeys.all(), 'detail'] as const,
  list: (params: UseGetTicketsQueryParams) => [...ticketsKeys.lists(), params],
  lists: () => [...ticketsKeys.all(), 'list'] as const,
};
