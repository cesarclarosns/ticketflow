import { privateApi, publicApi } from '@libs/apis'
import { z } from 'zod'
import { useAuthStore } from '@stores'
import { AxiosError } from 'axios'
import { Cookies } from 'react-cookie'
import { COOKIES } from '@common/constants/cookies'
import { TSignInUser, TSignUpUser } from '@common/models/user'

const cookies = new Cookies()

const refreshDataSchema = z
  .object({
    accessToken: z.string(),
  })
  .passthrough()

export const useRefresh = () => {
  const { setAuth, clearAuth } = useAuthStore()

  const refresh = async () => {
    try {
      const response = await privateApi.get('/auth/refresh')
      const data = refreshDataSchema.parse(response.data)
      setAuth(data)
      return data
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        //Refresh token has expired, logout user
        cookies.remove(COOKIES.persist)
        clearAuth()
      }
      throw err
    }
  }

  return {
    refresh,
  }
}

export const useSignIn = () => {
  const signIn = async (
    data: TSignInUser
  ): Promise<{ accessToken: string }> => {
    const response = await privateApi.post('/auth/sign-in', data)
    return response.data
  }

  return { signIn }
}

export const useSignUp = () => {
  const signUp = async (data: TSignUpUser) => {
    const response = await publicApi.post('/auth/sign-up', data)
    return response.data
  }

  return { signUp }
}

export const useSignOut = () => {
  const { clearAuth } = useAuthStore()

  const signOut = async () => {
    await privateApi.post('/auth/sign-out')
    cookies.remove(COOKIES.persist)
    clearAuth()
  }

  return { signOut }
}

export const useResetPassword = () => {
  const resetPassword = async (data: { email: string }) => {
    const response = await publicApi.post('/auth/reset-password', data)
    return response.data
  }

  return { resetPassword }
}

export const useResetPasswordCallback = () => {
  const resetPasswordCallback = async ({
    password,
    token,
  }: {
    password: string
    token: string
  }) => {
    const response = await publicApi.patch(
      `/auth/reset-password/callback?token=${token}`,
      {
        password,
      }
    )
    return response.data
  }

  return { resetPasswordCallback }
}
