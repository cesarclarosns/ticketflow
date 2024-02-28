import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type UpdateUser } from '@/schemas/users/update-user';

export function useUpdateUserMutation(id: string) {
  const queryCliet = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUser) => {
      const response = await api.patch(`users/${id}`, data);
      return response.data;
    },
    onSettled: (data, error) => {
      if (error) {
        return;
      }

      queryCliet.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}
