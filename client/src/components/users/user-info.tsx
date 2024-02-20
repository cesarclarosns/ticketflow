import { useUser } from '@hooks/users'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { getInitials } from '@/src/libs/utils'
import { UserAvatar } from './user-avatar'

export const UserInfo = ({ id }: { id: string }) => {
  const { data: user } = useUser(id)

  return (
    <div className='flex flex-col'>
      <div className='h-[70px] rounded-t-md bg-primary px-2 py-2'></div>
      <div className='rounded-b-md bg-background px-2 py-2'>
        <div className='-mt-12 py-2'>
          <UserAvatar
            user={user}
            className='h-14 w-14 bg-background p-1'
          ></UserAvatar>
        </div>

        <div className='flex flex-col gap-1 rounded-md  px-1 py-2'>
          <div>
            <div className='truncate px-2'>
              <p className='truncate font-semibold'>
                {user && `${user.firstName} ${user.lastName}`}
              </p>
              <p className='truncate text-sm text-muted-foreground'>
                {user && user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
