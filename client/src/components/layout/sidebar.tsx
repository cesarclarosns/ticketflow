'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/ui/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UserAvatar } from '@/components/users/user-avatar';
import { UserMenu } from '@/components/users/user-menu';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';
import { cn } from '@/libs/utils';

import { CommandMenu } from './command-menu';

const links = [
  {
    href: '/app/tickets',
    icon: Icons.TicketIcon,
    title: 'Tickets',
  },
];

export function Sidebar() {
  const { data: user } = useGetCurrentUserQuery();

  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-50 flex flex-col bg-background max-sm:border-t-2 max-sm:py-5 sm:h-screen sm:max-w-[250px] sm:border-r-2">
      <div className="flex flex-1 gap-4 max-sm:justify-between max-sm:px-5 sm:flex-col sm:py-5">
        <div className="hidden px-2 md:flex ">
          <CommandMenu className="bg-background text-base" />
        </div>

        {links.map((link) => {
          return (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                'flex items-center justify-between gap-2 rounded-md px-4 py-2 hover:text-muted-foreground',
                pathname.includes(link.href) ? 'font-bold' : '',
              )}
            >
              <span className="max-md:hidden">{link.title}</span>
              <link.icon />
            </Link>
          );
        })}

        <Popover>
          <PopoverTrigger className="sm:hidden">
            <UserAvatar className="h-10 w-10 md:h-10 md:w-10" user={user} />
          </PopoverTrigger>
          <PopoverContent className="m-0 p-0">
            <UserMenu />
          </PopoverContent>
        </Popover>
      </div>

      <div className="hidden h-fit justify-center gap-2 border-t-2 px-2 py-4 sm:flex md:justify-between">
        <Popover>
          <PopoverTrigger>
            <UserAvatar className="h-10 w-10 md:h-10 md:w-10" user={user} />
          </PopoverTrigger>
          <PopoverContent className="m-0 p-0">
            <UserMenu />
          </PopoverContent>
        </Popover>

        <div className="hidden truncate md:flex md:flex-1 md:flex-col">
          <p className="truncate font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
