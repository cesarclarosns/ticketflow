import { api } from '@libs/apis'
import { useAuthStore } from '@stores'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useRefresh } from '@hooks/auth'
import { useEffect } from 'react'

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean
}

let refreshTokenPromise: Promise<string> | undefined

export const useApi = () => {
  const { auth } = useAuthStore()
  const { refresh } = useRefresh()

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (reqConfig) => {
        if (!reqConfig.headers['Authorization']) {
          reqConfig.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return reqConfig
      },
      (err) => Promise.reject(err)
    )

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err instanceof AxiosError) {
          const prevRequest = err.config as CustomInternalAxiosRequestConfig

          if (err.config && err.response && err.response.status === 401) {
            if (!refreshTokenPromise) {
              refreshTokenPromise = refresh().then((data) => {
                refreshTokenPromise = undefined
                return data.accessToken
              })
            }

            if (refreshTokenPromise) {
              return refreshTokenPromise.then((token) => {
                prevRequest.headers['Authorization'] = `Bearer ${token}`
                return api(prevRequest)
              })
            }
          }
        }
        return Promise.reject(err)
      }
    )

    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [auth, refresh])

  return { api }
}
