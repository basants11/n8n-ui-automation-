import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowMind AI - AI-Powered Workflow Automation',
  description: 'Create powerful automations with AI. Build workflows visually using natural language.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <div className="fixed inset-0 bg-grid bg-grid-size bg-dots opacity-50 pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 pointer-events-none" />
        {children}
      </body>
    </html>
  )
}
