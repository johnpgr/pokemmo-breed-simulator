import type { Metadata } from "next"
import { ThemeProvider } from "@/components/ui/themes/ThemeProvider"
import { ThemeToggle } from "@/components/ui/themes/ThemeToggle"
import { Toaster } from "../components/ui/toaster"
import { Toaster as ToasterSonner } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pokemmo breed planner",
  description: "A tool to help you plan your pokemmo breeding",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="mb-4">
            <ThemeToggle />
          </header>
          {props.children}
          <Toaster />
          <ToasterSonner />
        </ThemeProvider>
      </body>
    </html>
  )
}
