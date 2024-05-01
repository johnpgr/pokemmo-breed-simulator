import { assert } from "@/lib/assert"
import type { PokemonBreedTreeNode } from "./tree/BreedTreeNode"
import { PokemonBreedTreePosition } from "./tree/BreedTreePosition"
import { PokemonGender, PokemonSpecies } from "./pokemon"
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from "./consts"
import type { BreedTreePositionKey } from "./tree/useBreedTreeMap"

export enum BreedErrorKind {
    GenderCompatibility = "GenderCompatibility",
    EggGroupCompatibility = "EggGroupCompatibility",
    GenderlessCompatibility = "GenderlessCompatibility",
    NoFemale = "NoFemale",
    UnknownError = "UnknownError",
}

export class BreedError {
    constructor(
        public kind: BreedErrorKind,
        public positions: [PokemonBreedTreePosition, PokemonBreedTreePosition],
    ) {}
}

export class Breeder {
    constructor(private readonly breedMap: Map<BreedTreePositionKey, PokemonBreedTreeNode>) {}

    public breed(parent1: PokemonBreedTreeNode, parent2: PokemonBreedTreeNode): BreedError | null {
        const breedabilityError = this.checkBreedability(parent1, parent2)
        if (breedabilityError) {
            return breedabilityError
        }

        const childSpecies = this.getBreedChildSpecies(parent1, parent2)
        if (childSpecies instanceof BreedError) {
            return childSpecies
        }

        const childPosition = this.getChildPosition(parent1)
        const childGender = this.getChildGender(childSpecies)
        const childNode = this.breedMap.get(childPosition.key())
        assert.exists(childNode, "Child node should exist")

        childNode.species = childSpecies
        childNode.gender = childGender

        return null
    }

    private checkBreedability(parent1: PokemonBreedTreeNode, parent2: PokemonBreedTreeNode): BreedError | null {
        assert.exists(parent1.gender, "Parent 1 gender should exist")
        assert.exists(parent2.gender, "Parent 2 gender should exist")
        assert.exists(parent1.species, "Parent 1 species should exist")
        assert.exists(parent2.species, "Parent 2 species should exist")

        if (parent1.gender === PokemonGender.Genderless) {
            const parent1GenderlessEvoTree =
                GENDERLESS_POKEMON_EVOLUTION_TREE[
                    parent1.species.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
                ]
            if (!parent1GenderlessEvoTree.includes(parent2.species.number)) {
                return new BreedError(BreedErrorKind.GenderlessCompatibility, [parent1.position, parent2.position])
            }
        }

        if (parent2.gender === PokemonGender.Genderless) {
            const parent2GenderlessEvoTree =
                GENDERLESS_POKEMON_EVOLUTION_TREE[
                    parent2.species.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
                ]
            if (!parent2GenderlessEvoTree.includes(parent1.species.number)) {
                return new BreedError(BreedErrorKind.GenderlessCompatibility, [parent1.position, parent2.position])
            }
        }

        const genderCompatible = parent1.gender !== parent2.gender
        if (!genderCompatible) {
            return new BreedError(BreedErrorKind.GenderCompatibility, [parent1.position, parent2.position])
        }

        const eggTypeCompatible = parent1.species.eggGroups.some((e) => parent2.species!.eggGroups.includes(e))
        if (!eggTypeCompatible) {
            return new BreedError(BreedErrorKind.EggGroupCompatibility, [parent1.position, parent2.position])
        }

        return null
    }

    private getBreedChildSpecies(
        parent1: PokemonBreedTreeNode,
        parent2: PokemonBreedTreeNode,
    ): PokemonSpecies | BreedError {
        const [female] = [parent1, parent2].filter((p) => p.gender === PokemonGender.Female)

        if (!female) {
            return new BreedError(BreedErrorKind.NoFemale, [parent1.position, parent2.position])
        }

        assert.exists(female.species)
        const childSpecies = female.species

        return childSpecies
    }

    private getChildPosition(parent1: PokemonBreedTreeNode): PokemonBreedTreePosition {
        const childRow = parent1.position.row - 1
        const childCol = Math.floor(parent1.position.col / 2)
        const childPosition = new PokemonBreedTreePosition(childRow, childCol)

        return childPosition
    }

    private getChildGender(child: PokemonSpecies): PokemonGender {
        const genderlessSpeciesPkdxNrs = Object.keys(GENDERLESS_POKEMON_EVOLUTION_TREE).map(Number)
        if (genderlessSpeciesPkdxNrs.includes(child.number)) {
            return PokemonGender.Genderless
        }

        return Math.random() * 100 > child.percentageMale ? PokemonGender.Female : PokemonGender.Male
    }
}
