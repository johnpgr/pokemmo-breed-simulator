import { Toaster } from "./components/ui/sonner.tsx"
import { BreedContextProvider } from "./contexts/breed-context/index.tsx"
import { PokemonToBreedSelect } from "./components/pokemon/PokemonBreedSelect"
import { PokemonBreedTreeView } from "./components/pokemon/PokemonBreedTreeView"
import { ThemeProvider } from "./components/ui/theme-provider/index.tsx"
import { ThemeToggle } from "./components/ui/theme-toggle.tsx"

export default function App() {
  return (
    <>
      <title>PokeMMO Breeding Planner</title>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <BreedContextProvider>
          <ThemeToggle />
          <PokemonToBreedSelect />
          <PokemonBreedTreeView />
        </BreedContextProvider>
        <Toaster />
      </ThemeProvider>
    </>
  )
}
