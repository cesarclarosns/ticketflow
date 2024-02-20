import { useSignOut } from '@hooks/auth'
import { useCurrentUser } from '@hooks/users'
import { Icons } from '@components/ui/icons'
import { UserAvatar } from './user-avatar'
import { Separator } from '@components/ui/separator'
import { useState } from 'react'
import { EditUserProfileFormSheet } from './edit-user-profile-form-sheet'

export const UserMenu = () => {
  const { data: user } = useCurrentUser()
  const { signOut } = useSignOut()

  const [isEditUserProfileFormSheetOpen, setIsEditUserProfileFormSheetOpen] =
    useState(false)

  return (
    <>
      <div className='flex flex-col'>
        <div className='h-[70px] rounded-t-md bg-primary px-2 py-2'></div>
        <div className='rounded-b-md bg-background px-2 py-2'>
          <div className='-mt-12  py-2'>
            <UserAvatar
              user={user}
              className='h-14 w-14 bg-background p-1'
            ></UserAvatar>
          </div>

          <div className='flex flex-col gap-1 rounded-md px-1 py-2'>
            <div className='pb-2'>
              <div className='truncate px-2'>
                <p className='truncate font-semibold'>
                  {user && `${user.firstName} ${user.lastName}`}
                </p>
                <p className='truncate text-sm text-muted-foreground'>
                  {user && user?.email}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <div
                className='flex items-center gap-2 rounded-md px-2 py-1 hover:cursor-pointer hover:bg-secondary'
                onClick={() => setIsEditUserProfileFormSheetOpen(true)}
              >
                <Icons.Edit2Icon className='h-5 w-5 stroke-1' /> Edit profile
              </div>
            </div>

            <Separator />

            <div>
              <div
                onClick={() => signOut()}
                className='flex items-center gap-2 rounded-md px-2 py-1 hover:cursor-pointer hover:bg-secondary'
              >
                <Icons.LogOutIcon className='h-5 w-5 stroke-1' /> Sign out
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditUserProfileFormSheet
        onOpenChange={setIsEditUserProfileFormSheetOpen}
        open={isEditUserProfileFormSheetOpen}
      />
    </>
  )
}
