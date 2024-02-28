import { useMutation } from '@tanstack/react-query';
import { AxiosError, HttpStatusCode } from 'axios';

import { privateApi } from '@/libs/apis';
import { authSchema } from '@/schemas/auth/auth';
import { useAuthStore } from '@/stores/auth-store';

import { signOut } from './sign-out';

export async function refresh() {
  try {
    const response = await privateApi.get('/auth/refresh');
    const data = authSchema.parse(response.data);

    useAuthStore.getState().setAuth(data);
    return data;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === HttpStatusCode.Unauthorized
    ) {
      await signOut();
    }

    throw error;
  }
}
