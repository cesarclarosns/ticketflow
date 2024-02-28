import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/libs/apis';
import { type Auth } from '@/schemas/auth/auth';
import { type SignUp } from '@/schemas/auth/sign-up';
import { useAuthStore } from '@/stores/auth-store';

export function useSignUpMutation() {
  const { setAuth, setIsAuthenticated } = useAuthStore((state) => state);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUp): Promise<Auth> => {
      const response = await privateApi.post('/auth/sign-up', data);
      return response.data;
    },
    onSuccess(data) {
      setAuth(data);
      setIsAuthenticated(true);

      router.push('/app/tickets');
    },
  });
}
