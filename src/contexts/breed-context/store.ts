import React from "react"
import type {
  PokemonNature,
  PokemonSpecies,
} from "@/core/pokemon"
import type { PokemonIvSet } from "@/core/ivset"
import type { BreedErrors, PokemonBreedMap, PokemonBreedMapSerialized, ZBreedMap } from "@/core/types"

export class PokemonBreedTarget {
  ivSet: PokemonIvSet
  species: PokemonSpecies
  nature: PokemonNature | undefined

  get ivCount(): number {
    return this.ivSet.toArray().length
  }

  constructor(
    ivSet: PokemonIvSet,
    species: PokemonSpecies,
    nature?: PokemonNature | undefined,
  ) {
    this.ivSet = ivSet
    this.species = species
    this.nature = nature
  }
}

export interface BreedContext {
  breedTarget: PokemonBreedTarget | undefined
  setBreedTarget: (target: PokemonBreedTarget | undefined) => void
  breedErrors: BreedErrors
  setBreedErrors: (errors: BreedErrors) => void
  breedMap: PokemonBreedMap
  initializeBreedMap: (breedTarget: PokemonBreedTarget) => void,
  updateBreedTree: (args?: {
    runLogic?: boolean
    persist?: boolean
    map?: PokemonBreedMap
  }) => void
  savedTree: ZBreedMap | undefined
  serialize: () => PokemonBreedMapSerialized
  deserialize: (deserialized: PokemonBreedMapSerialized) => void
  reset: () => void
}

export const BreedContext = React.createContext<BreedContext>(
  {} as BreedContext,
)