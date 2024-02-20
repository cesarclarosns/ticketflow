/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@stores/auth.store'

const protectedPaths: string[] = ['/app']

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { auth } = useAuthStore((state) => state)

  useEffect(() => {
    const pathIsProtected = Boolean(
      protectedPaths.find((path) => pathname.includes(path))
    )

    if (!isLoading && !auth && pathIsProtected) {
      router.push('/')
    }

    setIsLoading(false)
  }, [pathname, auth, isLoading, router])

  if (isLoading) return null
  return children
}
