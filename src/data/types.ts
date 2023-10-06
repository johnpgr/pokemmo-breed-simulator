type Values<T> = T[keyof T]

export type Pokemon = {
    pokedexNumber: number
    name: string
    types: Array<IPokemonType>
    eggTypes: Array<IEggType>
    percentageMale: number
}

export const PokemonType = {
    Normal: "Normal",
    Fire: "Fire",
    Water: "Water",
    Electric: "Electric",
    Grass: "Grass",
    Ice: "Ice",
    Fighting: "Fighting",
    Poison: "Poison",
    Ground: "Ground",
    Flying: "Flying",
    Psychic: "Psychic",
    Bug: "Bug",
    Rock: "Rock",
    Ghost: "Ghost",
    Dragon: "Dragon",
    Dark: "Dark",
    Steel: "Steel",
} as const
export type IPokemonType = Values<typeof PokemonType>

export const EggType = {
    Monster: "Monster",
    WaterA: "Water A",
    WaterB: "Water B",
    WaterC: "Water C",
    Bug: "Bug",
    Flying: "Flying",
    Field: "Field",
    Fairy: "Fairy",
    Plant: "Plant",
    Humanoid: "Humanoid",
    Mineral: "Mineral",
    Chaos: "Chaos",
    Ditto: "Ditto",
    Dragon: "Dragon",
    CannotBreed: "Cannot Breed",
    Genderless: "Genderless",
} as const
export type IEggType = Values<typeof EggType>

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

export type NatureType = Values<typeof Nature>

export type PokemonSelectList = Array<{
    name: string
    number: number
    eggTypes: Array<IEggType>
}>
