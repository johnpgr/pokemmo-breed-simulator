import type { UsePokemonBreedMap } from "@/core/breed-map/hook"
import type { PokemonBreedMapSerialized, ZBreedMap } from "@/core/breed-map"
import React from "react"

export interface BreedContext {
  breedTree: UsePokemonBreedMap
  savedTree: ZBreedMap | undefined
  serialize: () => PokemonBreedMapSerialized
  deserialize: (deserialized: PokemonBreedMapSerialized) => void
  save: () => void
  load: () => void
  reset: () => void
}

export const BreedContext = React.createContext<BreedContext>(
  {} as BreedContext,
)
