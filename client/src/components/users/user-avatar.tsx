'use client';

import type * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getInitials } from '@/libs/utils';
import { type User } from '@/models/users/user';

export const UserAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    user: User | undefined;
  }
>(({ className, user, ...props }, ref) => {
  return (
    <Avatar
      ref={ref}
      className={cn('hover:cursor-pointer', className)}
      {...props}
    >
      <AvatarFallback className="bg-teal-500">
        {user ? getInitials(user?.firstName ?? user?.email) : ''}
      </AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = 'UseAvatar';
