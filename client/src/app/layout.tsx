import type { Metadata } from 'next'

import './globals.css'
import Providers from '@components/providers/providers'
import { Toaster } from '@components/ui/toaster'

import { GeistSans } from 'geist/font/sans'
import Layout from '@components/layout/layout'

export const metadata: Metadata = {
  title: 'Enroudesk',
  description: 'A simple web help desk system for a team like yours',
}

export default function RootLayout(props: {
  children: React.ReactNode
  marketing: React.ReactNode
  app: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={GeistSans.className}>
        <Providers>
          <Layout {...props} />
        </Providers>
        <Toaster></Toaster>
      </body>
    </html>
  )
}
