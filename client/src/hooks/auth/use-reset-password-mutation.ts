import { useMutation } from '@tanstack/react-query';

import { publicApi } from '@/libs/apis';
import { type ResetPassword } from '@/schemas/auth/reset-password';

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ResetPassword): Promise<void> => {
      await publicApi.post('/auth/reset-password', data);
    },
  });
}
