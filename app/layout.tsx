import type { Metadata } from 'next'
import { Geist, Geist_Mono, Syne, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SuppressWarnings } from '@/components/suppress-warnings'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const _dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: 'Funtern — Fun Internships, Bootcamps & Upskilling for Students',
  description:
    'Funtern makes learning fun. Explore bootcamps, workshops, summer camps, competitions, talks, and hands-on opportunities built for students who want to upskill and grow.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
      </head>
      <body className={`${_dmSans.variable} ${_syne.variable} noise-body font-sans antialiased`}>
        <SuppressWarnings />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
