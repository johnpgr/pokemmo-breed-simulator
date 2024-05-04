import { assert } from "@/lib/assert"
import { DITTO_PKDX_NR, GENDERLESS_POKEMON_EVOLUTION_TREE } from "./consts"
import { PokemonGender, PokemonSpecies } from "./pokemon"
import type { PokemonBreedTreeNode } from "./tree/BreedTreeNode"

export enum BreedError {
    GenderCompatibility = "GenderCompatibility",
    EggGroupCompatibility = "EggGroupCompatibility",
    GenderlessSpeciesCompatibility = "GenderlessSpeciesCompatibility",
    ChildDidNotChange = "ChildDidNotChange",
    IllegalNodePosition = "IllegalNodePosition",
}

export function breed(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
    child: PokemonBreedTreeNode,
): Set<BreedError> | PokemonSpecies {
    const errors = new Set<BreedError>()

    const breedabilityError = checkBreedability(parent1, parent2)
    if (breedabilityError) {
        errors.add(breedabilityError)
    }

    const childSpecies = getChildSpecies(parent1, parent2)
    if (!(childSpecies instanceof PokemonSpecies)) {
        errors.add(childSpecies)
    } else {
        if (child.species?.number === childSpecies.number) {
            errors.add(BreedError.ChildDidNotChange)
        }

        if (child.isRootNode()) {
            errors.add(BreedError.IllegalNodePosition)
        }

        if (errors.size === 0) {
            return childSpecies
        }
    }

    return errors
}

function checkBreedability(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
): BreedError | null {
    assert.exists(parent1.gender, "Parent 1 gender should exist")
    assert.exists(parent2.gender, "Parent 2 gender should exist")
    assert.exists(parent1.species, "Parent 1 species should exist")
    assert.exists(parent2.species, "Parent 2 species should exist")

    if (parent1.gender === PokemonGender.Genderless) {
        if (parent1.species.number === DITTO_PKDX_NR) {
            if (parent2.species.number !== DITTO_PKDX_NR) {
                return null
            }
        }

        const parent1GenderlessEvoTree =
            GENDERLESS_POKEMON_EVOLUTION_TREE[
                parent1.species
                    .number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
            ]
        if (!parent1GenderlessEvoTree.includes(parent2.species.number)) {
            return BreedError.GenderlessSpeciesCompatibility
        }
    }

    if (parent2.gender === PokemonGender.Genderless) {
        if (parent2.species.number === DITTO_PKDX_NR) {
            if (parent1.species.number !== DITTO_PKDX_NR) {
                return null
            }
        }

        const parent2GenderlessEvoTree =
            GENDERLESS_POKEMON_EVOLUTION_TREE[
                parent2.species
                    .number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
            ]
        if (!parent2GenderlessEvoTree.includes(parent1.species.number)) {
            return BreedError.GenderlessSpeciesCompatibility
        }
    }

    const genderCompatible = parent1.gender !== parent2.gender
    if (!genderCompatible) {
        return BreedError.GenderCompatibility
    }

    const eggTypeCompatible = parent1.species.eggGroups.some((e) =>
        parent2.species!.eggGroups.includes(e),
    )
    if (!eggTypeCompatible) {
        return BreedError.EggGroupCompatibility
    }

    return null
}

function getChildSpecies(
    parent1: PokemonBreedTreeNode,
    parent2: PokemonBreedTreeNode,
): BreedError | PokemonSpecies {
    assert.exists(parent1.gender, "Parent 1 gender should exist")
    assert.exists(parent2.gender, "Parent 2 gender should exist")
    assert.exists(parent1.species, "Parent 1 species should exist")
    assert.exists(parent2.species, "Parent 2 species should exist")

    if (parent1.species?.number === DITTO_PKDX_NR) {
        return parent2.species
    }
    if (parent2.species.number === DITTO_PKDX_NR) {
        return parent1.species
    }

    const females = [parent1, parent2].filter(
        (p) => p.gender === PokemonGender.Female,
    )

    if (females.length !== 1) {
        return BreedError.GenderCompatibility
    }

    assert.exists(females[0]!.species)
    const childSpecies = females[0]!.species

    return childSpecies
}
