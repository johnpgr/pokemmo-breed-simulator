import { ThemeProviderContext } from "@/components/ui/theme-provider/store"
import React from "react"

export const useTheme = () => {
  const context = React.use(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}