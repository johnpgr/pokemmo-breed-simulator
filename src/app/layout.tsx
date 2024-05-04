import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ui/themes/ThemeProvider"
import { ThemeToggle } from "@/components/ui/themes/ThemeToggle"
import { cn } from "@/lib/utils"
import { Toaster } from "../components/ui/toaster"
import "./globals.css"

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Pokemmo breed planner",
    description: "A tool to help you plan your pokemmo breeding",
}

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn("min-h-screen flex flex-col", fontSans.className)}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <header className="mb-4">
                        <ThemeToggle />
                    </header>
                    {props.children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
