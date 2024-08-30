import { assert } from "@/lib/assert"
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from "./consts"
import { PokemonGender, PokemonSpecies } from "./pokemon"
import type { PokemonBreedTree } from "./PokemonBreedTree"

export namespace PokemonBreed {
    export enum BreedErrorKind {
        GenderCompatibility = "GenderCompatibility",
        EggGroupCompatibility = "EggGroupCompatibility",
        GenderlessSpeciesCompatibility = "GenderlessSpeciesCompatibility",
        ChildDidNotChange = "ChildDidNotChange",
        RootNodeSpeciesMismatch = "RootNodeSpeciesMismatch",
    }

    export class BreedError {
        constructor(public kind: BreedErrorKind) {}
    }

    export function breed(
        parent1: PokemonBreedTree.Node,
        parent2: PokemonBreedTree.Node,
        child: PokemonBreedTree.Node,
    ): PokemonSpecies | Set<BreedError> {
        assert(parent1.gender, "Parent 1 gender should exist")
        assert(parent2.gender, "Parent 2 gender should exist")
        assert(parent1.species, "Parent 1 species should exist")
        assert(parent2.species, "Parent 2 species should exist")

        const errors = new Set<BreedError>()

        const genderlessCheckRes = checkGenderless(parent1, parent2)
        if (genderlessCheckRes instanceof BreedError) {
            errors.add(genderlessCheckRes)
        }

        const eggGroupCheckRes = checkEggGroups(parent1, parent2)
        if (eggGroupCheckRes instanceof BreedError) {
            errors.add(eggGroupCheckRes)
        }

        const genderCheckRes = checkGenders(parent1, parent2)
        if (genderCheckRes instanceof BreedError) {
            errors.add(genderCheckRes)
        }

        const childSpeciesRes = getChildSpecies(parent1, parent2)

        if (childSpeciesRes instanceof BreedError) {
            errors.add(childSpeciesRes)
            return errors
        }

        const childCheckRes = checkChild(child, childSpeciesRes)
        if (childCheckRes instanceof BreedError) {
            errors.add(childCheckRes)
        }

        if (errors.size === 0) {
            return childSpeciesRes as PokemonSpecies
        }

        return errors
    }

    function checkChild(child: PokemonBreedTree.Node, childSpecies: PokemonSpecies): void | BreedError {
        if (child.isRootNode()) {
            if (child.isGenderless()) {
                const rootNodeGenderlessTree = GENDERLESS_POKEMON_EVOLUTION_TREE[child.species!.number]
                assert(rootNodeGenderlessTree !== undefined, "GenderlessTree should exist for genderless Poke")

                if (!rootNodeGenderlessTree.includes(childSpecies.number)) {
                    return new BreedError(BreedErrorKind.RootNodeSpeciesMismatch)
                }
            } else if (child.species?.number !== childSpecies.number) {
                return new BreedError(BreedErrorKind.RootNodeSpeciesMismatch)
            }
        } else {
            if (child.species?.number === childSpecies.number) {
                return new BreedError(BreedErrorKind.ChildDidNotChange)
            }
        }
    }

    function checkEggGroups(parent1: PokemonBreedTree.Node, parent2: PokemonBreedTree.Node): void | BreedError {
        if (parent1.isDitto() || parent2.isDitto()) {
            return
        }

        const eggGroupsMatch = parent1
            .species!.eggGroups.filter(Boolean)
            .some((eggGroup) => parent2.species!.eggGroups.filter(Boolean).includes(eggGroup))

        if (!eggGroupsMatch) {
            return new BreedError(BreedErrorKind.EggGroupCompatibility)
        }
    }

    function checkGenders(parent1: PokemonBreedTree.Node, parent2: PokemonBreedTree.Node): void | BreedError {
        if (parent1.isGenderless() && parent2.isGenderless()) {
            return
        }

        if (parent1.gender === parent2.gender) {
            return new BreedError(BreedErrorKind.GenderCompatibility)
        }
    }

    function checkGenderless(parent1: PokemonBreedTree.Node, parent2: PokemonBreedTree.Node): void | BreedError {
        if (parent1.isGenderless()) {
            if (parent1.isDitto()) {
                if (!parent2.isDitto()) {
                    return
                }

                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }

            const parent1GenderlessEvoTree = GENDERLESS_POKEMON_EVOLUTION_TREE[parent1.species!.number]
            assert(parent1GenderlessEvoTree !== undefined, "GenderlessEvoTree should exist for genderless Poke")

            if (!parent1GenderlessEvoTree.includes(parent2.species!.number)) {
                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }
        }

        if (parent2.gender === PokemonGender.Genderless) {
            if (parent2.isDitto()) {
                if (!parent1.isDitto()) {
                    return
                }

                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }

            const parent2GenderlessEvoTree = GENDERLESS_POKEMON_EVOLUTION_TREE[parent2.species!.number]
            assert(parent2GenderlessEvoTree !== undefined, "GenderlessTree should exist for genderless Poke")

            if (!parent2GenderlessEvoTree.includes(parent1.species!.number)) {
                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }
        }
    }

    function getChildSpecies(
        parent1: PokemonBreedTree.Node,
        parent2: PokemonBreedTree.Node,
    ): PokemonSpecies | BreedError {
        if (parent1.isDitto()) {
            return parent2.species!
        }
        if (parent2.isDitto()) {
            return parent1.species!
        }

        if (parent1.isGenderless() && parent2.isGenderless()) {
            //assume that both parents are correctly in the same GenderlessEvolutionTree
            return parent1.species!
        }

        const females = [parent1, parent2].filter((p) => p.gender === PokemonGender.Female)

        if (females.length !== 1) {
            return new BreedError(BreedErrorKind.GenderCompatibility)
        }

        return females[0]!.species!
    }
}
