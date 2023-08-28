export const columnsPerRow = [1, 2, 4, 8, 16, 32] as const

export const Gender = {
  MALE: "M",
  FEMALE: "F",
  GENDERLESS: null,
} as const

export const numberOfPokemonsFromIVNumber = {
  2: { natured: { a: 2, b: 1 }, natureless: { a: 1, b: 1 } },
  3: { natured: { a: 4, b: 2, c: 1 }, natureless: { a: 2, b: 1, c: 1 } },
  4: {
    natured: { a: 6, b: 5, c: 3, d: 1 },
    natureless: { a: 3, b: 2, c: 2, d: 1 },
  },
  5: {
    natured: { a: 11, b: 10, c: 6, d: 2, e: 2 },
    natureless: { a: 5, b: 5, c: 3, d: 2, e: 1 },
  },
} as const

export const pokemonIVsPositions = {
  2: {
    natured: {
      "2,0": "nature",
      "2,1": "a",
      "2,2": "a",
      "2,3": "b",
    },
    natureless: {
      "1,0": "a",
      "1,1": "b",
    },
  },
  3: {
    natured: {
      "3,0": "nature",
      "3,1": "a",
      "3,2": "a",
      "3,3": "b",
      "3,4": "a",
      "3,5": "b",
      "3,6": "a",
      "3,7": "c",
    },
    natureless: {
      "2,0": "a",
      "2,1": "b",
      "2,2": "a",
      "2,3": "c",
    },
  },
  4: {
    natured: {
      "4,0": "nature",
      "4,1": "a",
      "4,2": "a",
      "4,3": "b",
      "4,4": "a",
      "4,5": "b",
      "4,6": "a",
      "4,7": "c",
      "4,8": "a",
      "4,9": "b",
      "4,10": "a",
      "4,11": "c",
      "4,12": "b",
      "4,13": "c",
      "4,14": "b",
      "4,15": "d",
    },
    natureless: {
      "3,0": "a",
      "3,1": "b",
      "3,2": "a",
      "3,3": "c",
      "3,4": "b",
      "3,5": "c",
      "3,6": "b",
      "3,7": "d",
    },
  },
  5: {
    natured: {
      "5,0": "a",
      "5,1": "b",
      "5,2": "a",
      "5,3": "c",
      "5,4": "b",
      "5,5": "c",
      "5,6": "b",
      "5,7": "d",
      "5,8": "b",
      "5,9": "c",
      "5,10": "b",
      "5,11": "d",
      "5,12": "c",
      "5,13": "d",
      "5,14": "c",
      "5,15": "e",
      "5,16": "nature",
      "5,17": "b",
      "5,18": "b",
      "5,19": "c",
      "5,20": "b",
      "5,21": "c",
      "5,22": "b",
      "5,23": "d",
      "5,24": "b",
      "5,25": "c",
      "5,26": "b",
      "5,27": "d",
      "5,28": "c",
      "5,29": "d",
      "5,30": "c",
      "5,31": "e",
    },
    natureless: {
      "4,0": "a",
      "4,1": "b",
      "4,2": "a",
      "4,3": "c",
      "4,4": "b",
      "4,5": "c",
      "4,6": "b",
      "4,7": "d",
      "4,8": "b",
      "4,9": "c",
      "4,10": "b",
      "4,11": "d",
      "4,12": "c",
      "4,13": "d",
      "4,14": "c",
      "4,15": "e",
    },
  },
} as const

type PokemonIVsPositions = typeof pokemonIVsPositions
type _LastRowMapping = PokemonIVsPositions[2 | 3 | 4 | 5]
export type LastRowMapping = _LastRowMapping["natured" | "natureless"]
