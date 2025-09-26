import { PokemonBreederKind } from "@/core/pokemon"
import { assert } from "@/lib/utils"
import type { PokemonBreedTreeRowMapped } from "@/core/types"

/**
 * This type represents what the last row of pokemon iv's should be, depending on the nr of generations
 */
export const LASTROW_MAPPING: Record<
  number,
  {
    natured: PokemonBreedTreeRowMapped
    natureless: PokemonBreedTreeRowMapped
  }
> = {
  2: {
    natured: {
      ["2,0"]: PokemonBreederKind.Nature,
      ["2,1"]: PokemonBreederKind.A,
      ["2,2"]: PokemonBreederKind.A,
      ["2,3"]: PokemonBreederKind.B,
    },
    natureless: {
      ["1,0"]: PokemonBreederKind.A,
      ["1,1"]: PokemonBreederKind.B,
    },
  },
  3: {
    natured: {
      ["3,0"]: PokemonBreederKind.Nature,
      ["3,1"]: PokemonBreederKind.A,
      ["3,2"]: PokemonBreederKind.A,
      ["3,3"]: PokemonBreederKind.B,
      ["3,4"]: PokemonBreederKind.A,
      ["3,5"]: PokemonBreederKind.B,
      ["3,6"]: PokemonBreederKind.A,
      ["3,7"]: PokemonBreederKind.B,
    },
    natureless: {
      ["2,0"]: PokemonBreederKind.A,
      ["2,1"]: PokemonBreederKind.B,
      ["2,2"]: PokemonBreederKind.A,
      ["2,3"]: PokemonBreederKind.C,
    },
  },
  4: {
    natured: {
      ["4,0"]: PokemonBreederKind.Nature,
      ["4,1"]: PokemonBreederKind.A,
      ["4,2"]: PokemonBreederKind.A,
      ["4,3"]: PokemonBreederKind.B,
      ["4,4"]: PokemonBreederKind.A,
      ["4,5"]: PokemonBreederKind.B,
      ["4,6"]: PokemonBreederKind.A,
      ["4,7"]: PokemonBreederKind.C,
      ["4,8"]: PokemonBreederKind.A,
      ["4,9"]: PokemonBreederKind.B,
      ["4,10"]: PokemonBreederKind.A,
      ["4,11"]: PokemonBreederKind.C,
      ["4,12"]: PokemonBreederKind.B,
      ["4,13"]: PokemonBreederKind.C,
      ["4,14"]: PokemonBreederKind.B,
      ["4,15"]: PokemonBreederKind.D,
    },
    natureless: {
      ["3,0"]: PokemonBreederKind.A,
      ["3,1"]: PokemonBreederKind.B,
      ["3,2"]: PokemonBreederKind.A,
      ["3,3"]: PokemonBreederKind.C,
      ["3,4"]: PokemonBreederKind.B,
      ["3,5"]: PokemonBreederKind.C,
      ["3,6"]: PokemonBreederKind.B,
      ["3,7"]: PokemonBreederKind.D,
    },
  },
  5: {
    natured: {
      ["5,0"]: PokemonBreederKind.A,
      ["5,1"]: PokemonBreederKind.B,
      ["5,2"]: PokemonBreederKind.A,
      ["5,3"]: PokemonBreederKind.C,
      ["5,4"]: PokemonBreederKind.B,
      ["5,5"]: PokemonBreederKind.C,
      ["5,6"]: PokemonBreederKind.B,
      ["5,7"]: PokemonBreederKind.D,
      ["5,8"]: PokemonBreederKind.B,
      ["5,9"]: PokemonBreederKind.C,
      ["5,10"]: PokemonBreederKind.B,
      ["5,11"]: PokemonBreederKind.D,
      ["5,12"]: PokemonBreederKind.C,
      ["5,13"]: PokemonBreederKind.D,
      ["5,14"]: PokemonBreederKind.C,
      ["5,15"]: PokemonBreederKind.E,
      ["5,16"]: PokemonBreederKind.Nature,
      ["5,17"]: PokemonBreederKind.B,
      ["5,18"]: PokemonBreederKind.B,
      ["5,19"]: PokemonBreederKind.C,
      ["5,20"]: PokemonBreederKind.B,
      ["5,21"]: PokemonBreederKind.C,
      ["5,22"]: PokemonBreederKind.B,
      ["5,23"]: PokemonBreederKind.D,
      ["5,24"]: PokemonBreederKind.B,
      ["5,25"]: PokemonBreederKind.C,
      ["5,26"]: PokemonBreederKind.B,
      ["5,27"]: PokemonBreederKind.D,
      ["5,28"]: PokemonBreederKind.C,
      ["5,29"]: PokemonBreederKind.D,
      ["5,30"]: PokemonBreederKind.C,
      ["5,31"]: PokemonBreederKind.E,
    },
    natureless: {
      ["4,0"]: PokemonBreederKind.A,
      ["4,1"]: PokemonBreederKind.B,
      ["4,2"]: PokemonBreederKind.A,
      ["4,3"]: PokemonBreederKind.C,
      ["4,4"]: PokemonBreederKind.B,
      ["4,5"]: PokemonBreederKind.C,
      ["4,6"]: PokemonBreederKind.B,
      ["4,7"]: PokemonBreederKind.D,
      ["4,8"]: PokemonBreederKind.B,
      ["4,9"]: PokemonBreederKind.C,
      ["4,10"]: PokemonBreederKind.B,
      ["4,11"]: PokemonBreederKind.D,
      ["4,12"]: PokemonBreederKind.C,
      ["4,13"]: PokemonBreederKind.D,
      ["4,14"]: PokemonBreederKind.C,
      ["4,15"]: PokemonBreederKind.E,
    },
  },
}

export type PokemonCountByBreederKind = {
  kind: PokemonBreederKind
  count: { natured: number; natureless: number }
}[]

/**
 * Returns a list of pokemon counts grouped by breeder kind
 * This list is used to render the pokemon breed tree depending on the number of generations that is selected
 */
export function getPokemonCountByBreederKind(
  generations: number,
): PokemonCountByBreederKind {
  assert(generations >= 2 && generations <= 5, "Invalid generations number")
  const lastRowPositions = LASTROW_MAPPING[generations]!
  const breederKinds = [
    PokemonBreederKind.A,
    PokemonBreederKind.B,
    PokemonBreederKind.C,
    PokemonBreederKind.D,
    PokemonBreederKind.E,
  ]
  const natured: PokemonBreederKind[] = Object.values(
    lastRowPositions.natured,
  ).filter((kind) => kind !== PokemonBreederKind.Nature)
  const natureless = Object.values(lastRowPositions.natureless)
  const naturedGroupped = Object.groupBy(natured, (kind) => kind)
  const naturelessGroupped = Object.groupBy(natureless, (kind) => kind)

  return breederKinds.map((kind) => ({
    kind,
    count: {
      natured: naturedGroupped[kind]?.length ?? 0,
      natureless: naturelessGroupped[kind]?.length ?? 0,
    },
  }))
}
