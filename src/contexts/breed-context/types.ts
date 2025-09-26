import type {
  BreedErrors,
  PokemonBreedMap,
  PokemonBreedMapSerialized,
  ZBreedMap,
} from "@/core/types"
import type { PokemonBreedTarget } from "@/core/breed-target"

export interface BreedContext {
  breedTarget: PokemonBreedTarget | undefined
  setBreedTarget: (target: PokemonBreedTarget | undefined) => void
  breedErrors: BreedErrors
  setBreedErrors: (errors: BreedErrors) => void
  breedMap: PokemonBreedMap
  initializeBreedMap: (breedTarget: PokemonBreedTarget) => void
  updateBreedTree: (args?: {
    compute?: boolean
    persist?: boolean
    map?: PokemonBreedMap
  }) => void
  savedTree: ZBreedMap | undefined
  serialize: () => PokemonBreedMapSerialized
  deserialize: (deserialized: PokemonBreedMapSerialized) => void
  reset: () => void
}
