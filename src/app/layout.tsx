import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from './_providers/themes'
import { ModeToggle } from './_components/mode-toggle'
import { cn } from '@/lib/utils'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Pokemmo breed planner',
  description: 'A tool to help you plan your pokemon breeding',
}

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen flex flex-col bg-background',
          fontSans.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="mb-4">
            <ModeToggle />
          </header>
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  )
}
