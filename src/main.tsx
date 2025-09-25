import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "./components/ui/sonner.tsx"
import { BreedContextProvider } from "./contexts/breed-context/index.tsx"
import AppData from "./data/app-data"
import { PokemonToBreedSelect } from "./components/pokemon/PokemonBreedSelect"
import { PokemonBreedTreeView } from "./components/pokemon/PokemonBreedTreeView"
import { ThemeProvider } from "./components/ui/theme-provider.tsx"
import { ThemeToggle } from "./components/ui/theme-toggle.tsx"
import "./index.css"

await AppData.init()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <BreedContextProvider>
        <ThemeToggle />
        <PokemonToBreedSelect />
        <PokemonBreedTreeView />
      </BreedContextProvider>
      <Toaster />
    </ThemeProvider>
  </StrictMode>,
)
