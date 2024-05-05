import { assert } from "@/lib/assert"
import { DITTO_PKDX_NR, GENDERLESS_POKEMON_EVOLUTION_TREE } from "./consts"
import { PokemonGender, PokemonSpecies } from "./pokemon"
import type { PokemonBreedTreeNode } from "./tree/BreedTreeNode"

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
): Set<BreedError> | PokemonSpecies {
    assert.exists(parent1.gender, "Parent 1 gender should exist")
    assert.exists(parent2.gender, "Parent 2 gender should exist")
    assert.exists(parent1.species, "Parent 1 species should exist")
    assert.exists(parent2.species, "Parent 2 species should exist")

    const errors = new Set<BreedError>()

    const genderlessError = checkGenderless(parent1, parent2)
    genderlessError && errors.add(genderlessError)
    const eggGroupError = checkEggGroups(parent1, parent2)
    eggGroupError && errors.add(eggGroupError)
    const genderError = checkGenders(parent1, parent2)
    genderError && errors.add(genderError)

    const childSpecies = getChildSpecies(parent1, parent2)
    if (!(childSpecies instanceof PokemonSpecies)) {
        errors.add(childSpecies)
    } else {
        if (
            child.isRootNode() &&
            child.species?.number !== childSpecies.number
        ) {
            errors.add(BreedError.RootNodeSpeciesMismatch)
        } else {
            if (child.species?.number === childSpecies.number) {
                errors.add(BreedError.ChildDidNotChange)
            }
        }

        if (errors.size === 0) {
            return childSpecies
        }
    }

    return errors
}

function checkEggGroups(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
): BreedError | null {
    if (parent1.isDitto() || parent2.isDitto()) {
        return null
    }

    if (
        !parent1.species!.eggGroups.some((e) =>
            parent2.species!.eggGroups.includes(e),
        )
    ) {
        return BreedError.EggGroupCompatibility
    }

    return null
}

function checkGenders(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
): BreedError | null {
    if (parent1.isGenderless() && parent2.isGenderless()) {
        return null
    }

    if (parent1.gender === parent2.gender) {
        return BreedError.GenderCompatibility
    }

    return null
}

function checkGenderless(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
): BreedError | null {
    if (parent1.gender === PokemonGender.Genderless) {
        if (parent1.isDitto()) {
            if (!parent2.isDitto()) {
                return null
            }

            return BreedError.GenderlessSpeciesCompatibility
        }

        const parent1GenderlessEvoTree =
            GENDERLESS_POKEMON_EVOLUTION_TREE[
                parent1.species!
                    .number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
            ]

        if (!parent1GenderlessEvoTree.includes(parent2.species!.number)) {
            return BreedError.GenderlessSpeciesCompatibility
        }
    }

    if (parent2.gender === PokemonGender.Genderless) {
        if (parent2.isDitto()) {
            if (!parent1.isDitto()) {
                return null
            }

            return BreedError.GenderlessSpeciesCompatibility
        }

        const parent2GenderlessEvoTree =
            GENDERLESS_POKEMON_EVOLUTION_TREE[
                parent2.species!
                    .number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
            ]

        if (!parent2GenderlessEvoTree.includes(parent1.species!.number)) {
            return BreedError.GenderlessSpeciesCompatibility
        }
    }

    return null
}

function getChildSpecies(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
): BreedError | PokemonSpecies {
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

    const females = [parent1, parent2].filter(
        (p) => p.gender === PokemonGender.Female,
    )

    if (females.length !== 1) {
        return BreedError.GenderCompatibility
    }

    return females[0]!.species!
}
