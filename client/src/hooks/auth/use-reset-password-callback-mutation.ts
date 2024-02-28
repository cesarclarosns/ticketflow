import { useMutation } from '@tanstack/react-query';

import { publicApi } from '@/libs/apis';
import { type ResetPasswordCallback } from '@/schemas/auth/reset-password-callback';

export function useResetPasswordCallbackMutation() {
  return useMutation({
    mutationFn: async (data: ResetPasswordCallback): Promise<void> => {
      await publicApi.post('/auth/reset-password/callback', data);
    },
  });
}
