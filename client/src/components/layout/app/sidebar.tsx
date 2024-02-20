/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCurrentUser } from '@hooks/users'
import Link from 'next/link'
import { Icons } from '@components/ui/icons'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@libs/utils'
import { useEffect, useState } from 'react'
import { UserAvatar } from '@components/users/user-avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { UserMenu } from '@components/users/user-menu'
import { UserInfo } from '@components/users/user-info'
import { CommandMenu } from './command-menu'
import { Separator } from '../../ui/separator'

interface Link {
  href?: string
  title: string
  isSelected: boolean
  icon: () => React.ReactNode
}

export function Sidebar() {
  const { data: user } = useCurrentUser()

  const router = useRouter()
  const [links, setLinks] = useState<Link[]>([
    {
      href: '/app',
      title: 'Dashboard',
      isSelected: false,
      icon: () => (
        <Icons.LayoutDashboardIcon className='h-7 w-7 stroke-1 sm:h-5 sm:w-5' />
      ),
    },
    {
      href: '/app/tickets',
      title: 'Tickets',
      isSelected: false,
      icon: () => (
        <Icons.TicketIcon className='h-7 w-7 stroke-1 sm:h-5 sm:w-5' />
      ),
    }
  ])
  const pathname = usePathname()

  useEffect(() => {
    setLinks(
      links.map((link) => {
        link.isSelected = false
        if (pathname == link.href) link.isSelected = true
        return link
      })
    )
  }, [pathname])

  return (
    <div className='sticky bottom-0 z-20 flex h-fit flex-col bg-zinc-100 sm:top-0 sm:h-screen sm:max-w-[250px]'>
      <div className='hidden px-2 py-5 md:flex '>
        <CommandMenu className='bg-background' />
      </div>

      <div className='hidden gap-2 px-2 py-4 sm:flex sm:flex-1 sm:flex-col sm:overflow-y-auto '>
        {links.map((link, i) => {
          return (
            <div key={i}>
              <div
                onClick={() => {
                  if (link.href) router.push(link.href)
                }}
                className={cn(
                  'rounded-xl px-2 py-2',
                  'flex items-center justify-center gap-2 hover:cursor-pointer md:justify-start',
                  link.isSelected && 'bg-zinc-200'
                )}
              >
                {<link.icon />}
                <span className='hidden font-medium md:inline'>
                  {link.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className='hidden sm:flex'>
        <Separator />
      </div>

      <div className='flex w-full items-center justify-between px-6 py-2 sm:px-2'>
        {links.map((link, i) => {
          return (
            <div key={i}>
              <div
                onClick={() => {
                  if (link.href) router.push(link.href)
                }}
                className={cn(
                  'rounded-xl px-2 py-2',
                  link.isSelected && 'bg-zinc-200',
                  'flex items-center justify-center gap-2 hover:cursor-pointer sm:hidden'
                )}
              >
                {<link.icon />}
              </div>
            </div>
          )
        })}

        <div className='sticky bottom-0 flex items-center gap-2 px-5 py-3 sm:w-full sm:px-2 sm:py-4'>
          <HoverCard>
            <HoverCardTrigger>
              <Popover>
                <PopoverTrigger>
                  <UserAvatar
                    className='h-10 w-10 md:h-10 md:w-10'
                    user={user}
                  />
                </PopoverTrigger>
                <PopoverContent className='m-0 p-0'>
                  <UserMenu />
                </PopoverContent>
              </Popover>
            </HoverCardTrigger>
            <HoverCardContent className='m-0 p-0'>
              {user && <UserInfo id={user._id}></UserInfo>}
            </HoverCardContent>
          </HoverCard>

          <div className='hidden truncate md:flex md:flex-1 md:flex-col'>
            <p className='truncate font-semibold'>
              {user?.firstName} {user?.lastName}
            </p>
            <p className='truncate text-sm text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
