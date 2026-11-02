import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rapid Review Training Dashboard',
  description: 'Full-stack evaluation and assertion review workspace powered by Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f1f3f4] text-[#202124] antialiased">
        {children}
      </body>
    </html>
  )
}
