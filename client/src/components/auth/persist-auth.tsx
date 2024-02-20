/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useRefresh } from '@hooks/auth'
import { useAuthStore } from '@stores/auth.store'
import { useCookies } from 'react-cookie'
import Loading from '@components/loading'
import { COOKIES } from '@common/constants/cookies'

export default function PersistAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [cookies] = useCookies([COOKIES.persist])
  const [persist] = useState(cookies['persist'] || false)
  const { auth } = useAuthStore((state) => state)
  const { refresh } = useRefresh()

  useEffect(() => {
    let isMounted = true

    const refreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    if (!auth && persist) {
      refreshToken()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [])

  return isLoading ? <Loading></Loading> : children
}
