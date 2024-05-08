import { assert } from "@/lib/assert"
import { Err, Ok, Result } from "@/lib/results"
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from "./consts"
import { PokemonGender, PokemonSpecies } from "./pokemon"
import type { PokemonBreedTreeNode } from "./tree/BreedTreeNode"

export namespace PokemonBreed {
    export enum BreedError {
        GenderCompatibility = "GenderCompatibility",
        EggGroupCompatibility = "EggGroupCompatibility",
        GenderlessSpeciesCompatibility = "GenderlessSpeciesCompatibility",
        ChildDidNotChange = "ChildDidNotChange",
        RootNodeSpeciesMismatch = "RootNodeSpeciesMismatch",
    }

    export function breed(
        parent1: PokemonBreedTreeNode,
        parent2: PokemonBreedTreeNode,
        child: PokemonBreedTreeNode,
    ): Result<PokemonSpecies, Set<BreedError>> {
        assert.exists(parent1.gender, "Parent 1 gender should exist")
        assert.exists(parent2.gender, "Parent 2 gender should exist")
        assert.exists(parent1.species, "Parent 1 species should exist")
        assert.exists(parent2.species, "Parent 2 species should exist")

        const errors = new Set<BreedError>()

        const genderlessCheck = checkGenderless(parent1, parent2)
        if (!genderlessCheck.ok) {
            errors.add(genderlessCheck.error)
        }

        const eggGroupCheck = checkEggGroups(parent1, parent2)
        if (!eggGroupCheck.ok) {
            errors.add(eggGroupCheck.error)
        }

        const genderCheck = checkGenders(parent1, parent2)
        if (!genderCheck.ok) {
            errors.add(genderCheck.error)
        }

        const childSpecies = getChildSpecies(parent1, parent2)

        if (!childSpecies.ok) {
            errors.add(childSpecies.error)
            return Err(errors)
        }

        const childCheck = checkChild(child, childSpecies)
        if (!childCheck.ok) {
            errors.add(childCheck.error)
        }

        if (errors.size === 0) {
            return Ok(childSpecies as PokemonSpecies)
        }

        return Err(errors)
    }

    function checkChild(child: PokemonBreedTreeNode, childSpecies: PokemonSpecies): Result<{}, BreedError> {
        if (child.isRootNode()) {
            if (child.isGenderless()) {
                const rootNodeGenderlessTree =
                    GENDERLESS_POKEMON_EVOLUTION_TREE[
                        child.species!.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
                    ]

                if (!rootNodeGenderlessTree.includes(childSpecies.number)) {
                    return Err(BreedError.RootNodeSpeciesMismatch)
                }
            } else if (child.species?.number !== childSpecies.number) {
                return Err(BreedError.RootNodeSpeciesMismatch)
            }
        } else {
            if (child.species?.number === childSpecies.number) {
                return Err(BreedError.ChildDidNotChange)
            }
        }

        return Ok({})
    }

    function checkEggGroups(parent1: PokemonBreedTreeNode, parent2: PokemonBreedTreeNode): Result<{}, BreedError> {
        if (parent1.isDitto() || parent2.isDitto()) {
            return Ok({})
        }

        if (!parent1.species!.eggGroups.some((e) => parent2.species!.eggGroups.includes(e))) {
            return Err(BreedError.EggGroupCompatibility)
        }

        return Ok({})
    }

    function checkGenders(parent1: PokemonBreedTreeNode, parent2: PokemonBreedTreeNode): Result<{}, BreedError> {
        if (parent1.isGenderless() && parent2.isGenderless()) {
            return Ok({})
        }

        if (parent1.gender === parent2.gender) {
            return Err(BreedError.GenderCompatibility)
        }

        return Ok({})
    }

    function checkGenderless(parent1: PokemonBreedTreeNode, parent2: PokemonBreedTreeNode): Result<{}, BreedError> {
        if (parent1.gender === PokemonGender.Genderless) {
            if (parent1.isDitto()) {
                if (!parent2.isDitto()) {
                    return Ok({})
                }

                return Err(BreedError.GenderlessSpeciesCompatibility)
            }

            const parent1GenderlessEvoTree =
                GENDERLESS_POKEMON_EVOLUTION_TREE[
                    parent1.species!.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
                ]

            if (!parent1GenderlessEvoTree.includes(parent2.species!.number)) {
                return Err(BreedError.GenderlessSpeciesCompatibility)
            }
        }

        if (parent2.gender === PokemonGender.Genderless) {
            if (parent2.isDitto()) {
                if (!parent1.isDitto()) {
                    return Ok({})
                }

                return Err(BreedError.GenderlessSpeciesCompatibility)
            }

            const parent2GenderlessEvoTree =
                GENDERLESS_POKEMON_EVOLUTION_TREE[
                    parent2.species!.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
                ]

            if (!parent2GenderlessEvoTree.includes(parent1.species!.number)) {
                return Err(BreedError.GenderlessSpeciesCompatibility)
            }
        }

        return Ok({})
    }

    function getChildSpecies(
        parent1: PokemonBreedTreeNode,
        parent2: PokemonBreedTreeNode,
    ): Result<PokemonSpecies, BreedError> {
        if (parent1.isDitto()) {
            return Ok(parent2.species!)
        }
        if (parent2.isDitto()) {
            return Ok(parent1.species!)
        }

        if (parent1.isGenderless() && parent2.isGenderless()) {
            //assume that both parents are correctly in the same GenderlessEvolutionTree
            return Ok(parent1.species!)
        }

        const females = [parent1, parent2].filter((p) => p.gender === PokemonGender.Female)

        if (females.length !== 1) {
            return Err(BreedError.GenderCompatibility)
        }

        return Ok(females[0]!.species!)
    }
}
