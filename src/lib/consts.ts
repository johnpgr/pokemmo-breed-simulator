import { type PokemonSpeciesRaw } from "@/core/pokemon"

export const BREED_ITEM_COSTS = {
  iv: 10000,
  nature: 6000,
} as const

export const BREED_EXPECTED_COSTS: Record<
  number,
  { natured: number; natureless: number }
> = {
  2: {
    natured: 75000,
    natureless: 20000,
  },
  3: {
    natured: 170000,
    natureless: 65000,
  },
  4: {
    natured: 355000,
    natureless: 155000,
  },
  5: {
    natured: 715000,
    natureless: 340000,
  },
}

export const POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS: Record<
  number,
  { natured: Record<string, number>; natureless: Record<string, number> }
> = {
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
}

export const IV_COLOR_DICT = {
  Hp: "#55b651",
  Attack: "#F44336",
  Defense: "#f78025",
  SpecialAttack: "#e925f7",
  SpecialDefense: "#f7e225",
  Speed: "#25e2f7",
  Nature: "#e0f1f4",
} as const
export type IvColor = (typeof IV_COLOR_DICT)[keyof typeof IV_COLOR_DICT]

export const NODE_SCALE_BY_COLOR_AMOUNT: Record<number, string> = {
  5: "100%",
  4: "90%",
  3: "80%",
  2: "75%",
  1: "66%",
}

export const SPRITE_SCALE_BY_COLOR_AMOUNT: Record<number, string> = {
  5: "100%",
  4: "110%",
  3: "120%",
  2: "130%",
  1: "150%",
}

export const GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE: Record<number, number> =
  {
    87.5: 5000,
    75: 5000,
    50: 5000,
    25: 9000,
    12.5: 21000,
    0: 0,
    100: 0,
  }

export const DITTO: PokemonSpeciesRaw = {
  id: 132,
  name: "Ditto",
  types: ["Normal"],
  eggGroups: ["Ditto"],
  percentageMale: 0,
}
