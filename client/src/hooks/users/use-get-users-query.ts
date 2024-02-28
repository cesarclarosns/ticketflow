import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type User } from '@/models/users/user';

import { usersKeys } from './users-keys';

export type UseGetUsersQueryParams = {
  skip: number;
  limit: number;
  sort?: 'email' | '-email';
  query?: string;
};

export const useGetUsersQuery = (params: UseGetUsersQueryParams) => {
  return useQuery({
    queryFn: async (): Promise<User[]> => {
      const searchParams = new URLSearchParams();
      searchParams.append('skip', params.skip.toString());
      searchParams.append('limit', params.limit.toString());

      if (params.sort) searchParams.append('sort', params.sort);
      if (params.query) searchParams.append('query', params.query);

      const response = await api.get(`users?${searchParams.toString()}`);
      return response.data;
    },
    queryKey: usersKeys.list(params),
  });
};
