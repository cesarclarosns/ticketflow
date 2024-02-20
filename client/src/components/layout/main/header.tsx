'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@stores'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const { auth } = useAuthStore()

  return (
    <div className='sticky top-0 flex flex-col bg-zinc-100'>
      <div className='container flex items-center justify-between px-4 py-5'>
        <div>
          <h1 className='font-bold'>Enroudesk</h1>
        </div>
        {auth ? (
          <>
            <Button onClick={() => router.push('/app')}>Open Enroudesk</Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push('/auth/sign-in')}>
              Sign in
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
