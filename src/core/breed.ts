import { assert } from "@/lib/assert"
import { PokemonNode } from "./PokemonBreedMap"
import { PokemonGender, PokemonSpecies, PokemonSpeciesRaw } from "./pokemon"

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

export class PokemonBreedService {
    constructor(
        private readonly pokemonSpeciesRaw: PokemonSpeciesRaw[],
        private readonly pokemonEvolutions: number[][],
    ) {}

    public breed(parent1: PokemonNode, parent2: PokemonNode, child: PokemonNode): PokemonSpecies | BreedErrors {
        assert(parent1.gender, "Parent 1 gender should exist")
        assert(parent2.gender, "Parent 2 gender should exist")
        assert(parent1.species, "Parent 1 species should exist")
        assert(parent2.species, "Parent 2 species should exist")

        const errors = new BreedErrors()

        const genderlessCheckRes = this.checkGenderless(parent1, parent2)
        if (genderlessCheckRes instanceof BreedError) {
            errors.add(genderlessCheckRes)
        }

        const eggGroupCheckRes = this.checkEggGroups(parent1, parent2)
        if (eggGroupCheckRes instanceof BreedError) {
            errors.add(eggGroupCheckRes)
        }

        const genderCheckRes = this.checkGenders(parent1, parent2)
        if (genderCheckRes instanceof BreedError) {
            errors.add(genderCheckRes)
        }

        const childSpeciesRes = this.getChildSpecies(parent1, parent2)

        if (childSpeciesRes instanceof BreedError) {
            errors.add(childSpeciesRes)
            return errors
        }

        const childCheckRes = this.checkChild(child, childSpeciesRes)
        if (childCheckRes instanceof BreedError) {
            errors.add(childCheckRes)
        }

        if (errors.size === 0) {
            return childSpeciesRes as PokemonSpecies
        }

        return errors
    }

    private checkChild(child: PokemonNode, childSpecies: PokemonSpecies): void | BreedError {
        if (child.isRootNode()) {
            if (child.species?.isGenderless()) {
                const rootNodeGenderlessTree = child.species.getEvolutionTree(this.pokemonEvolutions)

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

    private checkEggGroups(parent1: PokemonNode, parent2: PokemonNode): void | BreedError {
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

    private checkGenders(parent1: PokemonNode, parent2: PokemonNode): void | BreedError {
        if (parent1.species?.isGenderless() && parent2.species?.isGenderless()) {
            return
        }

        if (parent1.gender === parent2.gender) {
            return new BreedError(BreedErrorKind.GenderCompatibility)
        }
    }

    private checkGenderless(parent1: PokemonNode, parent2: PokemonNode): void | BreedError {
        if (parent1.species?.isGenderless()) {
            if (parent1.species?.isDitto()) {
                if (!parent2.species?.isDitto()) {
                    return
                }

                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }

            const parent1GenderlessEvoTree = parent1.species.getEvolutionTree(this.pokemonEvolutions)

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

            const parent2GenderlessEvoTree = parent2.species?.getEvolutionTree(this.pokemonEvolutions)

            if (!parent2GenderlessEvoTree.includes(parent1.species!.id)) {
                return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
            }
        }
    }

    private getChildSpecies(parent1: PokemonNode, parent2: PokemonNode): PokemonSpecies | BreedError {
        const getBaseSpecies = (p: PokemonSpecies) => {
            const id = p.getBaseEvolutionId(this.pokemonEvolutions)
            const raw = this.pokemonSpeciesRaw.find((p)=> p.id === id)
            assert(raw !== undefined, "Pokemon Base evolution Species not found")
            return PokemonSpecies.parse(raw)
        }

        if (parent1.species?.isDitto()) {
            return getBaseSpecies(parent2.species!)
        }

        if (parent2.species?.isDitto()) {
            return getBaseSpecies(parent1.species!)
        }

        if (parent1.species?.isGenderless() && parent2.species?.isGenderless()) {
            // both parents are correctly in the same GenderlessEvolutionTree because this function should run after checkGenderless()
            return getBaseSpecies(parent1.species)
        }

        const female =
            parent1.gender === PokemonGender.Female ? parent1 : parent2.gender === PokemonGender.Female ? parent2 : null

        if(female){
            return getBaseSpecies(female.species!)
        }

        return new BreedError(BreedErrorKind.GenderCompatibility)
    }
}
