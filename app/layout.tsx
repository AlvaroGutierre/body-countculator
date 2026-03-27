import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import LocaleProvider from '@/components/LocaleProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Body Countculator',
  description:
    'An algorithm estimates your body count based on your profile. Anonymous, no sign-up required.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a0a] text-white">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
