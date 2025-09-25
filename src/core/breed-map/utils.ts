import { PokemonBreederKind } from "@/core/pokemon"
import { assert } from "@/lib/utils"
import type { PokemonBreedTreeRowMapped } from "."
import { PokemonBreedMapPosition } from "./position"

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
      [new PokemonBreedMapPosition(2, 0).key]: PokemonBreederKind.Nature,
      [new PokemonBreedMapPosition(2, 1).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(2, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(2, 3).key]: PokemonBreederKind.B,
    },
    natureless: {
      [new PokemonBreedMapPosition(1, 0).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(1, 1).key]: PokemonBreederKind.B,
    },
  },
  3: {
    natured: {
      [new PokemonBreedMapPosition(3, 0).key]: PokemonBreederKind.Nature,
      [new PokemonBreedMapPosition(3, 1).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(3, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(3, 3).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(3, 4).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(3, 5).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(3, 6).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(3, 7).key]: PokemonBreederKind.B,
    },
    natureless: {
      [new PokemonBreedMapPosition(2, 0).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(2, 1).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(2, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(2, 3).key]: PokemonBreederKind.C,
    },
  },
  4: {
    natured: {
      [new PokemonBreedMapPosition(4, 0).key]: PokemonBreederKind.Nature,
      [new PokemonBreedMapPosition(4, 1).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 3).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 4).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 5).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 6).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 7).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 8).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 9).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 10).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 11).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 12).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 13).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 14).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 15).key]: PokemonBreederKind.D,
    },
    natureless: {
      [new PokemonBreedMapPosition(3, 0).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(3, 1).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(3, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(3, 3).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(3, 4).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(3, 5).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(3, 6).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(3, 7).key]: PokemonBreederKind.D,
    },
  },
  5: {
    natured: {
      [new PokemonBreedMapPosition(5, 0).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(5, 1).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(5, 3).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 4).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 5).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 6).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 7).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(5, 8).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 9).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 10).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 11).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(5, 12).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 13).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(5, 14).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 15).key]: PokemonBreederKind.E,
      [new PokemonBreedMapPosition(5, 16).key]: PokemonBreederKind.Nature,
      [new PokemonBreedMapPosition(5, 17).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 18).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 19).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 20).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 21).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 22).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 23).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(5, 24).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 25).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 26).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(5, 27).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(5, 28).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 29).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(5, 30).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(5, 31).key]: PokemonBreederKind.E,
    },
    natureless: {
      [new PokemonBreedMapPosition(4, 0).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 1).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 2).key]: PokemonBreederKind.A,
      [new PokemonBreedMapPosition(4, 3).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 4).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 5).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 6).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 7).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(4, 8).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 9).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 10).key]: PokemonBreederKind.B,
      [new PokemonBreedMapPosition(4, 11).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(4, 12).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 13).key]: PokemonBreederKind.D,
      [new PokemonBreedMapPosition(4, 14).key]: PokemonBreederKind.C,
      [new PokemonBreedMapPosition(4, 15).key]: PokemonBreederKind.E,
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
