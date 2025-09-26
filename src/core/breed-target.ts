import type { PokemonIvSet } from "@/core/ivset"
import type { PokemonNature, PokemonSpecies } from "@/core/pokemon"

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
