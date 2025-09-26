import type { MonsterSpriteMeta } from "@/lib/data"
import { assert } from "@/lib/utils"
import { z } from "zod"
import { Data } from "@/lib/data"

//prettier-ignore
export const PokemonType = {
    Fire:     "Fire",
    Water:    "Water",
    Grass:    "Grass",
    Electric: "Electric",
    Flying:   "Flying",
    Normal:   "Normal",
    Bug:      "Bug",
    Poison:   "Poison",
    Ground:   "Ground",
    Rock:     "Rock",
    Fighting: "Fighting",
    Psychic:  "Psychic",
    Ghost:    "Ghost",
    Ice:      "Ice",
    Dragon:   "Dragon",
    Dark:     "Dark",
    Steel:    "Steel",
} as const

export type PokemonType = (typeof PokemonType)[keyof typeof PokemonType]

//prettier-ignore
export const PokemonNature = {
    Hardy:   "Hardy",
    Lonely:  "Lonely",
    Brave:   "Brave",
    Adamant: "Adamant",
    Naughty: "Naughty",
    Bold:    "Bold",
    Docile:  "Docile",
    Relaxed: "Relaxed",
    Impish:  "Impish",
    Lax:     "Lax",
    Timid:   "Timid",
    Hasty:   "Hasty",
    Serious: "Serious",
    Jolly:   "Jolly",
    Naive:   "Naive",
    Modest:  "Modest",
    Mild:    "Mild",
    Quiet:   "Quiet",
    Bashful: "Bashful",
    Rash:    "Rash",
    Calm:    "Calm",
    Gentle:  "Gentle",
    Sassy:   "Sassy",
    Careful: "Careful",
    Quirky:  "Quirky",
} as const

export type PokemonNature = (typeof PokemonNature)[keyof typeof PokemonNature]

export const ZPokemonNature = z.enum(Object.values(PokemonNature))

//prettier-ignore
export const PokemonEggGroup = {
    Monster:     "Monster",
    WaterA:      "WaterA",
    WaterB:      "WaterB",
    WaterC:      "WaterC",
    Bug:         "Bug",
    Flying:      "Flying",
    Field:       "Field",
    Fairy:       "Fairy",
    Mineral:     "Mineral",
    Plant:       "Plant",
    Humanoid:    "Humanoid",
    Chaos:       "Chaos",
    Ditto:       "Ditto",
    Dragon:      "Dragon",
    CannotBreed: "CannotBreed",
    Genderless:  "Genderless",
} as const

export type PokemonEggGroup =
  (typeof PokemonEggGroup)[keyof typeof PokemonEggGroup]

//prettier-ignore
export const PokemonIv = {
    HP:             "Hp",
    Attack:         "Attack",
    Defense:        "Defense",
    SpecialAttack:  "SpecialAttack",
    SpecialDefense: "SpecialDefense",
    Speed:          "Speed",
} as const

export type PokemonIv = (typeof PokemonIv)[keyof typeof PokemonIv]
export const ZPokemonIv = z.enum(Object.values(PokemonIv))

export const PokemonGender = {
  Female: "Female",
  Male: "Male",
  Genderless: "Genderless",
} as const

export type PokemonGender = (typeof PokemonGender)[keyof typeof PokemonGender]
export const ZPokemonGender = z.enum(Object.values(PokemonGender))

export type PokemonSpeciesRaw = {
  id: number
  name: string
  types: string[]
  eggGroups: string[]
  percentageMale: number
}

export class PokemonSpecies {
  id: number
  name: string
  types: [PokemonType, PokemonType?]
  eggGroups: [PokemonEggGroup, PokemonEggGroup?]
  percentageMale: number

  constructor(
    id: number,
    name: string,
    types: [PokemonType, PokemonType?],
    eggGroups: [PokemonEggGroup, PokemonEggGroup?],
    percentageMale: number,
  ) {
    this.id = id
    this.name = name
    this.types = types
    this.eggGroups = eggGroups
    this.percentageMale = percentageMale
  }

  static parse(data: PokemonSpeciesRaw): PokemonSpecies {
    const types = Object.values(PokemonType)
    const eggGroups = Object.values(PokemonEggGroup)

    //@ts-expect-error this is ok
    assert(types.includes(data.types[0]), "Invalid type")
    if (data.types[1]) {
      //@ts-expect-error this is ok
      assert(types.includes(data.types[1]), "Invalid type")
    }

    assert(
      //@ts-expect-error this is ok
      eggGroups.includes(data.eggGroups[0]),
      `Invalid egg group ${data.eggGroups[0]} valids are ${eggGroups}`,
    )
    if (data.eggGroups[1]) {
      assert(
        //@ts-expect-error this is ok
        eggGroups.includes(data.eggGroups[1]),
        `Invalid egg group ${data.eggGroups[1]} valids are ${eggGroups}`,
      )
    }

    return new PokemonSpecies(
      data.id,
      data.name,
      [data.types[0] as PokemonType, data.types[1] as PokemonType],
      [
        data.eggGroups[0] as PokemonEggGroup,
        data.eggGroups[1] as PokemonEggGroup | undefined,
      ],
      data.percentageMale,
    )
  }

  public isDitto(): boolean {
    return this.eggGroups[0] === PokemonEggGroup.Ditto
  }

  public isGenderless(): boolean {
    return this.eggGroups[0] === PokemonEggGroup.Genderless
  }

  public getEvolutionTree(pokemonEvolutions: number[][]): number[] {
    const evoTree = pokemonEvolutions.find((t) => t.includes(this.id))
    assert(evoTree, `No evolution tree found for ${this.name}`)

    return evoTree
  }

  public getBaseEvolutionId(pokemonEvolutions: number[][]): number {
    const tree = this.getEvolutionTree(pokemonEvolutions)
    const base = tree[0]
    assert(base !== undefined, "Pokemon Base evolution not found")
    return base
  }

  get spriteMeta(): MonsterSpriteMeta {
    return Data.monsterMapping[this.id]
  }
}

/** In Pokemmo, in breeding, you can only breed a pokemon couple once.
 * You lose the parents on a breed, and receive the offspring.
 * That's why we need a certain number of pokemon kind, grouped here by a, b, c, d, e & nature.
 * https://pokemmo.shoutwiki.com/wiki/Breeding
 */
export const PokemonBreederKind = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  Nature: "Nature",
} as const

export type PokemonBreederKind =
  (typeof PokemonBreederKind)[keyof typeof PokemonBreederKind]
