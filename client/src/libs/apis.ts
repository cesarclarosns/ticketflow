import { env } from '@app/env.mjs'
import axios from 'axios'

export const publicApi = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}`,
})

/**
 * Api that sends cookies used to refresh tokens
 */
export const privateApi = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}`,
  withCredentials: true,
})

/**
 * Api with interceptors to refresh accessToken and refreshToken
 */
export const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}`,
})
