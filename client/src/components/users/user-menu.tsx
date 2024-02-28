import { useState } from 'react';

import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { signOut } from '@/hooks/auth/sign-out';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';

import { ThemeDropdownMenu } from '../theme-dropdown-menu';
import { EditUserProfileFormSheet } from './edit-user-profile-form-sheet';
import { UserAvatar } from './user-avatar';

export const UserMenu = () => {
  const { data: user } = useGetCurrentUserQuery();

  const [isEditUserProfileFormSheetOpen, setIsEditUserProfileFormSheetOpen] =
    useState(false);

  return (
    <>
      <div className="flex flex-col">
        <div className="rounded-b-md bg-background px-2 py-4">
          <UserAvatar
            user={user}
            className="h-14 w-14 bg-background p-1"
          ></UserAvatar>

          <div className="flex flex-col gap-1 rounded-md px-1">
            <div className="pb-2">
              <div className="truncate px-2">
                <p className="truncate font-semibold">
                  {user && `${user.firstName} ${user.lastName}`}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user && user?.email}
                </p>
              </div>
            </div>

            <Separator />

            <ThemeDropdownMenu
              trigger={
                <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:cursor-pointer hover:bg-secondary">
                  <Icons.SunMoonIcon className="h-5 w-5 stroke-1" />
                  Theme
                </div>
              }
            />

            <Separator />

            <div
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:cursor-pointer hover:bg-secondary"
              onClick={() => setIsEditUserProfileFormSheetOpen(true)}
            >
              <Icons.Edit2Icon className="h-5 w-5 stroke-1" /> Edit profile
            </div>

            <Separator />

            <div
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:cursor-pointer hover:bg-secondary"
            >
              <Icons.LogOutIcon className="h-5 w-5 stroke-1" /> Sign out
            </div>
          </div>
        </div>
      </div>

      <EditUserProfileFormSheet
        onOpenChange={setIsEditUserProfileFormSheetOpen}
        open={isEditUserProfileFormSheetOpen}
      />
    </>
  );
};
