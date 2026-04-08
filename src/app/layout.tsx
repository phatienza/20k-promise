import type { Metadata } from 'next'

import './globals.css'
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://the20kpromise.com'),
  title: 'The 20K Promise',
  description: 'Documenting a Filipino investor\'s journey to ₱2,000,000 — ₱20,000 every month. Real stocks. Real numbers. No filters.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'The 20K Promise',
    description: '₱20,000 every month. Building toward ₱2,000,000. Transparency in every peso.',
    type: 'website',
    url: 'https://the20kpromise.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The 20K Promise',
    description: '₱20,000 every month. Building toward ₱2,000,000.',
    images: ['/og-image.png'],
  },
  
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics /> 
      </body>
    </html>
  )
}
