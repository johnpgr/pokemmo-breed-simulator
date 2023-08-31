import { raise } from "@/lib/utils"
import { useContext } from "react"
import { PokemonToBreedContextPrimitive } from "."

export function usePokemonToBreed() {
  const ctx = useContext(PokemonToBreedContextPrimitive)

  return ctx ?? raise("usePokemonToBreed must be used within a PokemonToBreedContextProvider")
}
