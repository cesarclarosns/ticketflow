'use client'

import { useCurrentUser } from '@hooks/users'
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { cn, getInitials } from '@libs/utils'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'
import { TUser } from '@/src/common/models/user'

export const UserAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    user: TUser | undefined
  }
>(({ className, user, ...props }, ref) => {
  return (
    <Avatar
      ref={ref}
      className={cn('hover:cursor-pointer', className)}
      {...props}
    >
      <AvatarFallback className='bg-teal-500'>
        {user ? getInitials(user?.firstName ?? user?.email) : ''}
      </AvatarFallback>
    </Avatar>
  )
})

UserAvatar.displayName = 'UseAvatar'
