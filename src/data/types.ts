export type Pokemon = {
  pokedexNumber: number
  name: string
  types: Array<PokemonType>
  eggTypes: Array<EggType>
  percentageMale: number
}

export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"

export type EggType =
  | "Monster"
  | "Water A"
  | "Water B"
  | "Water C"
  | "Bug"
  | "Flying"
  | "Field"
  | "Fairy"
  | "Plant"
  | "Humanoid"
  | "Mineral"
  | "Chaos"
  | "Ditto"
  | "Dragon"
  | "Cannot Breed"
  | "Genderless"

export const Nature = {
  Hardy: "Hardy",
  Lonely: "Lonely",
  Brave: "Brave",
  Adamant: "Adamant",
  Naughty: "Naughty",
  Bold: "Bold",
  Docile: "Docile",
  Relaxed: "Relaxed",
  Impish: "Impish",
  Lax: "Lax",
  Timid: "Timid",
  Hasty: "Hasty",
  Serious: "Serious",
  Jolly: "Jolly",
  Naive: "Naive",
  Modest: "Modest",
  Mild: "Mild",
  Quiet: "Quiet",
  Bashful: "Bashful",
  Rash: "Rash",
  Calm: "Calm",
  Gentle: "Gentle",
  Sassy: "Sassy",
  Careful: "Careful",
  Quirky: "Quirky",
} as const

type Values<T> = T[keyof T]

export type NatureType = Values<typeof Nature>

export type PokemonSelectList = Array<{
  name: string
  number: number
  eggTypes: Array<EggType>
}>
