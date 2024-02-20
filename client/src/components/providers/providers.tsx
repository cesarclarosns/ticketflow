'use client'

import PersistAuth from '@components/auth/persist-auth'
import RouteGuard from '@components/auth/route-guard'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <QueryClientProvider client={queryClient}>
        <PersistAuth>
          <RouteGuard>{children}</RouteGuard>
        </PersistAuth>
      </QueryClientProvider>
    </CookiesProvider>
  )
}
