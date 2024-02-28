import './globals.css';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import Providers from '@/providers';

export const metadata: Metadata = {
  description: 'A simple web help desk system for a team like yours',
  title: 'TicketFlow',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>
        <Providers>{props.children}</Providers>
        <Toaster></Toaster>
      </body>
    </html>
  );
}
