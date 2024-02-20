'use client'

import { useHandleUserConnection } from '@hooks/use-handle-user-connection'
import { Sidebar } from '@components/layout/app/sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useHandleUserConnection()

  return (
    <div className='flex flex-col-reverse sm:flex-row'>
      <Sidebar />
      <div className='flex flex-1 flex-col max-sm:min-h-screen'>{children}</div>
    </div>
  )
}
