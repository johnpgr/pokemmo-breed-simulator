import { assert } from "@/lib/assert"
import { z } from "zod"

//prettier-ignore
export enum PokemonType {
    Fire     = "Fire",
    Water    = "Water",
    Grass    = "Grass",
    Electric = "Electric",
    Flying   = "Flying",
    Normal   = "Normal",
    Bug      = "Bug",
    Poison   = "Poison",
    Ground   = "Ground",
    Rock     = "Rock",
    Fighting = "Fighting",
    Psychic  = "Psychic",
    Ghost    = "Ghost",
    Ice      = "Ice",
    Dragon   = "Dragon",
    Dark     = "Dark",
    Steel    = "Steel",
}

//prettier-ignore
export enum PokemonNature {
    Hardy   = "Hardy",
    Lonely  = "Lonely",
    Brave   = "Brave",
    Adamant = "Adamant",
    Naughty = "Naughty",
    Bold    = "Bold",
    Docile  = "Docile",
    Relaxed = "Relaxed",
    Impish  = "Impish",
    Lax     = "Lax",
    Timid   = "Timid",
    Hasty   = "Hasty",
    Serious = "Serious",
    Jolly   = "Jolly",
    Naive   = "Naive",
    Modest  = "Modest",
    Mild    = "Mild",
    Quiet   = "Quiet",
    Bashful = "Bashful",
    Rash    = "Rash",
    Calm    = "Calm",
    Gentle  = "Gentle",
    Sassy   = "Sassy",
    Careful = "Careful",
    Quirky  = "Quirky",
}
export const ZPokemonNature = z.nativeEnum(PokemonNature)

//prettier-ignore
export enum PokemonEggGroup {
    Monster     = "Monster",
    WaterA      = "WaterA",
    WaterB      = "WaterB",
    WaterC      = "WaterC",
    Bug         = "Bug",
    Flying      = "Flying",
    Field       = "Field",
    Fairy       = "Fairy",
    Mineral     = "Mineral",
    Plant       = "Plant",
    Humanoid    = "Humanoid",
    Chaos       = "Chaos",
    Ditto       = "Ditto",
    Dragon      = "Dragon",
    CannotBreed = "CannotBreed",
    Genderless  = "Genderless",
}

//prettier-ignore
export enum PokemonIv {
    HP             = "Hp",
    Attack         = "Attack",
    Defense        = "Defense",
    SpecialAttack  = "SpecialAttack",
    SpecialDefense = "SpecialDefense",
    Speed          = "Speed",
}
export const ZPokemonIv = z.nativeEnum(PokemonIv)

export enum PokemonGender {
    Female = "Female",
    Male = "Male",
    Genderless = "Genderless",
}
export const ZPokemonGender = z.nativeEnum(PokemonGender)

export type PokemonSpeciesRaw = {
    id: number
    name: string
    types: string[]
    eggGroups: string[]
    percentageMale: number
}

export class PokemonSpecies {
    constructor(
        public id: number,
        public name: string,
        public types: [PokemonType, PokemonType?],
        public eggGroups: [PokemonEggGroup, PokemonEggGroup?],
        public percentageMale: number,
    ) {}

    static parse(data: PokemonSpeciesRaw): PokemonSpecies {
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
            data.id,
            data.name,
            [data.types[0] as PokemonType, data.types[1] as PokemonType],
            [data.eggGroups[0] as PokemonEggGroup, data.eggGroups[1] as PokemonEggGroup | undefined],
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
