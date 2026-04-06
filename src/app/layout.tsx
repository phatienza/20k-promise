import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The 20K Promise',
  description: 'Documenting a Filipino investor\'s journey to ₱2,000,000 — ₱20,000 every month. Real stocks. Real numbers. No filters.',
  openGraph: {
    title: 'The 20K Promise',
    description: '₱20,000 every month. Building toward ₱2,000,000. Transparency in every peso.',
    type: 'website',
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
