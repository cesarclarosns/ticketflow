'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useHandleUserConnection } from '@/hooks/use-handle-user-connection';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useHandleUserConnection();

  return (
    <div className="flex h-screen flex-col-reverse sm:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
