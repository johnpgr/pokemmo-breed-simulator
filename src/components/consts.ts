import { PokemonIv } from "@/core/pokemon"

export const DEFAULT_IV_DROPDOWN_VALUES = [
    PokemonIv.HP,
    PokemonIv.Attack,
    PokemonIv.Defense,
    PokemonIv.SpecialDefense,
    PokemonIv.Speed,
]

export const IV_DROPDOWN_LIST_VALUES = [
    PokemonIv.HP,
    PokemonIv.Attack,
    PokemonIv.Defense,
    PokemonIv.SpecialDefense,
    PokemonIv.SpecialAttack,
    PokemonIv.Speed,
]

export const POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS = {
    2: { natured: { A: 2, B: 1 }, natureless: { A: 1, B: 1 } },
    3: { natured: { A: 4, B: 2, C: 1 }, natureless: { A: 2, B: 1, C: 1 } },
    4: {
        natured: { A: 6, B: 5, C: 3, D: 1 },
        natureless: { A: 3, B: 2, C: 2, D: 1 },
    },
    5: {
        natured: { A: 11, B: 10, C: 6, D: 2, E: 2 },
        natureless: { A: 5, B: 5, C: 3, D: 2, E: 1 },
    },
} as const
