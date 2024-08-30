import { assert } from "@/lib/assert"
import { PokemonBreederKind } from "./pokemon"
import { PokemonBreedTree } from "./PokemonBreedTree"

/**
 * This represents the evolution tree of a genderless egg group pokemon
 */
export type GenderlessPokemonEvolutionTree = Readonly<[number, number, number?]>

export const MAGNEMITE_TREE: GenderlessPokemonEvolutionTree = [81, 82, 462]
export const STARYU_TREE: GenderlessPokemonEvolutionTree = [120, 121]
export const BRONZOR_TREE: GenderlessPokemonEvolutionTree = [436, 437]
export const BELDUM_TREE: GenderlessPokemonEvolutionTree = [374, 375, 376]
export const BALTOY_TREE: GenderlessPokemonEvolutionTree = [343, 344]
export const VOLTORB_TREE: GenderlessPokemonEvolutionTree = [100, 101]
export const PORYGON_TREE: GenderlessPokemonEvolutionTree = [137, 233, 474]
export const KLINK_TREE: GenderlessPokemonEvolutionTree = [599, 600, 601]
export const GOLETT_TREE: GenderlessPokemonEvolutionTree = [622, 623]

/**
 * A dictionary of pokedex numbers to GenderlessPokemonEvolutionTree
 */
export const GENDERLESS_POKEMON_EVOLUTION_TREE: Record<number, GenderlessPokemonEvolutionTree> = {
    81: MAGNEMITE_TREE,
    82: MAGNEMITE_TREE,
    462: MAGNEMITE_TREE,
    120: STARYU_TREE,
    121: STARYU_TREE,
    436: BRONZOR_TREE,
    437: BRONZOR_TREE,
    374: BELDUM_TREE,
    375: BELDUM_TREE,
    376: BELDUM_TREE,
    343: BALTOY_TREE,
    344: BALTOY_TREE,
    100: VOLTORB_TREE,
    101: VOLTORB_TREE,
    137: PORYGON_TREE,
    233: PORYGON_TREE,
    474: PORYGON_TREE,
    599: KLINK_TREE,
    600: KLINK_TREE,
    601: KLINK_TREE,
    622: GOLETT_TREE,
    623: GOLETT_TREE,
}

type PokemonBreedTreeRowMapped = Record<PokemonBreedTree.PositionKey, PokemonBreederKind>

/// This type represents what the last row of pokemon iv's should be, depending on the nr of generations
export const POKEMON_BREEDTREE_LASTROW_MAPPING: Record<
    number,
    { natured: PokemonBreedTreeRowMapped; natureless: PokemonBreedTreeRowMapped }
> = {
    2: {
        natured: {
            [new PokemonBreedTree.Position(2, 0).key()]: PokemonBreederKind.Nature,
            [new PokemonBreedTree.Position(2, 1).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(2, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(2, 3).key()]: PokemonBreederKind.B,
        },
        natureless: {
            [new PokemonBreedTree.Position(1, 0).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(1, 1).key()]: PokemonBreederKind.B,
        },
    },
    3: {
        natured: {
            [new PokemonBreedTree.Position(3, 0).key()]: PokemonBreederKind.Nature,
            [new PokemonBreedTree.Position(3, 1).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(3, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(3, 3).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(3, 4).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(3, 5).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(3, 6).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(3, 7).key()]: PokemonBreederKind.B,
        },
        natureless: {
            [new PokemonBreedTree.Position(2, 0).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(2, 1).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(2, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(2, 3).key()]: PokemonBreederKind.C,
        },
    },
    4: {
        natured: {
            [new PokemonBreedTree.Position(4, 0).key()]: PokemonBreederKind.Nature,
            [new PokemonBreedTree.Position(4, 1).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 3).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 4).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 5).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 6).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 7).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 8).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 9).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 10).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 11).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 12).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 13).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 14).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 15).key()]: PokemonBreederKind.D,
        },
        natureless: {
            [new PokemonBreedTree.Position(3, 0).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(3, 1).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(3, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(3, 3).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(3, 4).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(3, 5).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(3, 6).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(3, 7).key()]: PokemonBreederKind.D,
        },
    },
    5: {
        natured: {
            [new PokemonBreedTree.Position(5, 0).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(5, 1).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(5, 3).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 4).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 5).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 6).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 7).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(5, 8).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 9).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 10).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 11).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(5, 12).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 13).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(5, 14).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 15).key()]: PokemonBreederKind.E,
            [new PokemonBreedTree.Position(5, 16).key()]: PokemonBreederKind.Nature,
            [new PokemonBreedTree.Position(5, 17).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 18).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 19).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 20).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 21).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 22).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 23).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(5, 24).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 25).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 26).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(5, 27).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(5, 28).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 29).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(5, 30).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(5, 31).key()]: PokemonBreederKind.E,
        },
        natureless: {
            [new PokemonBreedTree.Position(4, 0).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 1).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 2).key()]: PokemonBreederKind.A,
            [new PokemonBreedTree.Position(4, 3).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 4).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 5).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 6).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 7).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(4, 8).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 9).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 10).key()]: PokemonBreederKind.B,
            [new PokemonBreedTree.Position(4, 11).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(4, 12).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 13).key()]: PokemonBreederKind.D,
            [new PokemonBreedTree.Position(4, 14).key()]: PokemonBreederKind.C,
            [new PokemonBreedTree.Position(4, 15).key()]: PokemonBreederKind.E,
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
export function getPokemonCountByBreederKind(generations: number): PokemonCountByBreederKind {
    assert(generations >= 2 && generations <= 5, "Invalid generations number")
    const lastRowPositions = POKEMON_BREEDTREE_LASTROW_MAPPING[generations]!
    const breederKinds = [
        PokemonBreederKind.A,
        PokemonBreederKind.B,
        PokemonBreederKind.C,
        PokemonBreederKind.D,
        PokemonBreederKind.E,
    ]
    const natured: PokemonBreederKind[] = Object.values(lastRowPositions.natured).filter(
        (kind) => kind !== PokemonBreederKind.Nature,
    )
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
