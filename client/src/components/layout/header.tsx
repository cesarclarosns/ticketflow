'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export default function Header() {
  const router = useRouter();

  const { auth } = useAuthStore();

  return (
    <div className="sticky top-0 z-50 flex flex-col bg-background backdrop-blur-md">
      <div className="container flex items-center justify-between px-4 py-5">
        <div>
          <h1 className="text-xl font-bold">TicketFlow</h1>
        </div>
        {auth ? (
          <>
            <Button
              variant={'outline'}
              onClick={() => router.push('/app/tickets')}
            >
              Open TicketFlow
            </Button>
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
  );
}
