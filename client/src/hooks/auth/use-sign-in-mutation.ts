import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/libs/apis';
import { type Auth } from '@/schemas/auth/auth';
import { type SignIn } from '@/schemas/auth/sign-in';
import { useAuthStore } from '@/stores/auth-store';

export function useSignInMutation() {
  const router = useRouter();
  const { setAuth, setIsAuthenticated } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: async (data: SignIn): Promise<Auth> => {
      const response = await privateApi.post('/auth/sign-in', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      setIsAuthenticated(true);

      router.push('/app/tickets');
    },
  });
}
