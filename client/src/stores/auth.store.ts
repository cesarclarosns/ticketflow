import { create } from 'zustand'

interface IAuth {
  accessToken: string
}

interface IAuthState {
  auth: IAuth | undefined
  setAuth: (auth: IAuth) => void
  clearAuth: () => void
}

export const useAuthStore = create<IAuthState>()((set) => ({
  auth: undefined,
  setAuth: (auth) => set(() => ({ auth })),
  clearAuth: () =>
    set(() => ({
      auth: undefined,
    })),
}))
