import { assert } from "@/lib/assert"
import { z } from "zod"

export enum PokemonType {
    Fire = "Fire",
    Water = "Water",
    Grass = "Grass",
    Electric = "Electric",
    Flying = "Flying",
    Normal = "Normal",
    Bug = "Bug",
    Poison = "Poison",
    Ground = "Ground",
    Rock = "Rock",
    Fighting = "Fighting",
    Psychic = "Psychic",
    Ghost = "Ghost",
    Ice = "Ice",
    Dragon = "Dragon",
    Dark = "Dark",
    Steel = "Steel",
}

export enum PokemonNature {
    Hardy = "Hardy",
    Lonely = "Lonely",
    Brave = "Brave",
    Adamant = "Adamant",
    Naughty = "Naughty",
    Bold = "Bold",
    Docile = "Docile",
    Relaxed = "Relaxed",
    Impish = "Impish",
    Lax = "Lax",
    Timid = "Timid",
    Hasty = "Hasty",
    Serious = "Serious",
    Jolly = "Jolly",
    Naive = "Naive",
    Modest = "Modest",
    Mild = "Mild",
    Quiet = "Quiet",
    Bashful = "Bashful",
    Rash = "Rash",
    Calm = "Calm",
    Gentle = "Gentle",
    Sassy = "Sassy",
    Careful = "Careful",
    Quirky = "Quirky",
}
export const PokemonNatureSchema = z.nativeEnum(PokemonNature)

export enum PokemonEggGroup {
    Monster = "Monster",
    WaterA = "WaterA",
    WaterB = "WaterB",
    WaterC = "WaterC",
    Bug = "Bug",
    Flying = "Flying",
    Field = "Field",
    Fairy = "Fairy",
    Plant = "Plant",
    Humanoid = "Humanoid",
    Chaos = "Chaos",
    Ditto = "Ditto",
    Dragon = "Dragon",
    CannotBreed = "CannotBreed",
    Genderless = "Genderless",
}

export enum PokemonIv {
    HP = "Hp",
    Attack = "Attack",
    Defense = "Defense",
    SpecialAttack = "SpecialAttack",
    SpecialDefense = "SpecialDefense",
    Speed = "Speed",
}
export const PokemonIvSchema = z.nativeEnum(PokemonIv)

export enum PokemonGender {
    Female = "Female",
    Male = "Male",
    Genderless = "Genderless",
}
export const PokemonGenderSchema = z.nativeEnum(PokemonGender)

export type PokemonSpeciesUnparsed = {
    number: number
    name: string
    types: string[]
    eggGroups: string[]
    percentageMale: number
}

export class PokemonSpecies {
    constructor(
        public number: number,
        public name: string,
        public types: [PokemonType, PokemonType?],
        public eggGroups: [PokemonEggGroup, PokemonEggGroup?],
        public percentageMale: number,
    ) {}

    static parse(data: PokemonSpeciesUnparsed): PokemonSpecies {
        const types = Object.values(PokemonType)
        const eggGroups = Object.values(PokemonEggGroup)

        assert(types.includes(data.types[0]!), "Invalid type")
        if (data.types[1]) {
            assert(types.includes(data.types[1]), "Invalid type")
        }

        assert(eggGroups.includes(data.eggGroups[0]!), `Invalid egg group ${data.eggGroups[0]} valids are ${eggGroups}`)
        if (data.eggGroups[1]) {
            assert(
                eggGroups.includes(data.eggGroups[1]),
                `Invalid egg group ${data.eggGroups[1]} valids are ${eggGroups}`,
            )
        }

        return new PokemonSpecies(
            data.number,
            data.name,
            [data.types[0] as PokemonType, data.types[1] as PokemonType],
            [data.eggGroups[0] as PokemonEggGroup, data.eggGroups[1] as PokemonEggGroup | undefined],
            data.percentageMale,
        )
    }
}

/** In Pokemmo, in breeding, you can only breed a pokemon couple once.
 * You lose the parents on a breed, and receive the offspring.
 * That's why we need a certain number of pokemon kind, grouped here by a, b, c, d, e & nature.
 * https://pokemmo.shoutwiki.com/wiki/Breeding
 */
export enum PokemonBreederKind {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    Nature = "Nature",
}
