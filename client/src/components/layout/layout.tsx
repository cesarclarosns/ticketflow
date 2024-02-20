'use client'

import { usePathname } from 'next/navigation'
import Header from './main/header'
import Footer from './main/footer'

export default function Layout(props: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.includes('/app') || pathname.includes('/auth'))
    return <>{props.children}</>

  return (
    <div className='relative flex h-screen flex-col'>
      <Header></Header>
      <div className='flex flex-1 flex-col'>{props.children}</div>
      <Footer></Footer>
    </div>
  )
}
