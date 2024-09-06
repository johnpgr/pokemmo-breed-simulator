import { assert } from "@/lib/assert"
import { PokemonNode } from "./PokemonBreedMap"
import { PokemonGender, PokemonSpecies } from "./pokemon"

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

    export class BreedErrors extends Set<BreedError> {}

    export function breed(
        parent1: PokemonNode,
        parent2: PokemonNode,
        child: PokemonNode,
        pokemonEvolutions: number[][],
    ): PokemonSpecies | BreedErrors  {
        assert(parent1.gender, "Parent 1 gender should exist")
        assert(parent2.gender, "Parent 2 gender should exist")
        assert(parent1.species, "Parent 1 species should exist")
        assert(parent2.species, "Parent 2 species should exist")

        const errors = new BreedErrors()

        const genderlessCheckRes = checkGenderless(parent1, parent2, pokemonEvolutions)
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

        const childCheckRes = checkChild(child, childSpeciesRes, pokemonEvolutions)
        if (childCheckRes instanceof BreedError) {
            errors.add(childCheckRes)
        }

        if (errors.size === 0) {
            return childSpeciesRes as PokemonSpecies
        }

        return errors
    }

    function checkChild(
        child: PokemonNode,
        childSpecies: PokemonSpecies,
        pokemonEvolutions: number[][],
    ): void | BreedError {
        if (child.isRootNode()) {
            if (child.species?.isGenderless()) {
                const rootNodeGenderlessTree = child.species.getEvolutionTree(pokemonEvolutions)

                if (!rootNodeGenderlessTree.includes(childSpecies.id)) {
                    return new BreedError(BreedErrorKind.RootNodeSpeciesMismatch)
                }
            } else if (child.species?.id !== childSpecies.id) {
                return new BreedError(BreedErrorKind.RootNodeSpeciesMismatch)
            }
        } else {
            if (child.species?.id === childSpecies.id) {
                return new BreedError(BreedErrorKind.ChildDidNotChange)
            }
        }
    }

    function checkEggGroups(parent1: PokemonNode, parent2: PokemonNode): void | BreedError {
        if (parent1.species?.isDitto() || parent2.species?.isDitto()) {
            return
        }

        const eggGroupsMatch = parent1
            .species!.eggGroups.filter(Boolean)
            .some((eggGroup) => parent2.species!.eggGroups.filter(Boolean).includes(eggGroup))

        if (!eggGroupsMatch) {
            return new BreedError(BreedErrorKind.EggGroupCompatibility)
        }
    }

    function checkGenders(parent1: PokemonNode, parent2: PokemonNode): void | BreedError {
        if (parent1.species?.isGenderless() && parent2.species?.isGenderless()) {
            return
        }

        if (parent1.gender === parent2.gender) {
            return new BreedError(BreedErrorKind.GenderCompatibility)
        }
    }

    function checkGenderless(
        parent1: PokemonNode,
        parent2: PokemonNode,
        pokemonEvolutions: number[][],
    ): void | BreedError {
        if (parent1.species?.isGenderless()) {
            if (parent1.species?.isDitto()) {
                if (!parent2.species?.isDitto()) {
                    return
                }

                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }

            const parent1GenderlessEvoTree = parent1.species.getEvolutionTree(pokemonEvolutions)

            if (!parent1GenderlessEvoTree.includes(parent2.species!.id)) {
                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }
        }

        if (parent2.species?.isGenderless()) {
            if (parent2.species?.isDitto()) {
                if (!parent1.species?.isDitto()) {
                    return
                }

                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }

            const parent2GenderlessEvoTree = parent2.species?.getEvolutionTree(pokemonEvolutions)

            if (!parent2GenderlessEvoTree.includes(parent1.species!.id)) {
                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }
        }
    }

    function getChildSpecies(parent1: PokemonNode, parent2: PokemonNode): PokemonSpecies | BreedError {
        if (parent1.species?.isDitto()) {
            return parent2.species!
        }
        if (parent2.species?.isDitto()) {
            return parent1.species!
        }

        if (parent1.species?.isGenderless() && parent2.species?.isGenderless()) {
            //assume that both parents are correctly in the same GenderlessEvolutionTree
            return parent1.species!
        }

        const female = parent1.gender === PokemonGender.Female ? parent1 : parent2.gender === PokemonGender.Female ? parent2 : null
        return female.species ?? return new BreedError(BreedErrorKind.GenderCompatibility)

/*        const females = [parent1, parent2].filter((p) => p.gender === PokemonGender.Female)

        if (females.length !== 1) {
            return new BreedError(BreedErrorKind.GenderCompatibility)
        }

        return females[0]!.species! */
    }
}
