import { type UseGetUsersQueryParams } from './use-get-users-query';

export const usersKeys = {
  all: () => ['users'] as const,
  detail: (id: string | null) => [...usersKeys.details(), id] as const,
  details: () => [...usersKeys.all(), 'detail'] as const,
  list: (params: UseGetUsersQueryParams) => [...usersKeys.lists(), params],
  lists: () => [...usersKeys.all(), 'list'] as const,
  me: () => [...usersKeys.details(), 'me'] as const,
};
