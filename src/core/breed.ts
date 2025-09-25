import { assert } from "@/lib/assert"
import { PokemonNode } from "./PokemonBreedMap"
import { PokemonGender, PokemonSpecies, PokemonSpeciesRaw } from "./pokemon"

export enum BreedErrorKind {
  GenderCompatibility = "GENDER_COMPATIBILITY",
  EggGroupCompatibility = "EGG_GROUP_COMPATIBILITY",
  GenderlessSpeciesCompatibility = "GENDERLESS_SPECIES_COMPATIBILITY",
  ChildDidNotChange = "CHILD_DID_NOT_CHANGE",
  RootNodeSpeciesMismatch = "ROOT_NODE_SPECIES_MISMATCH",
}

export class BreedError {
  constructor(public kind: BreedErrorKind) {}
}

type BreedResult =
  | {
      success: true
      species: PokemonSpecies
    }
  | {
      success: false
      errors: BreedError[]
    }

export class PokemonBreedService {
  constructor(
    private readonly pokemonSpeciesRaw: PokemonSpeciesRaw[],
    private readonly pokemonEvolutions: number[][],
  ) {}

  public breed(
    parent1: PokemonNode,
    parent2: PokemonNode,
    child: PokemonNode,
  ): BreedResult {
    assert(parent1.gender, "Parent 1 gender should exist")
    assert(parent2.gender, "Parent 2 gender should exist")
    assert(parent1.species, "Parent 1 species should exist")
    assert(parent2.species, "Parent 2 species should exist")

    const errors: BreedError[] = [
      this.checkGenderless(parent1, parent2),
      this.checkEggGroups(parent1, parent2),
      this.checkGenders(parent1, parent2),
    ].filter((error): error is BreedError => error !== null)

    if (errors.length > 0) {
      return { success: false, errors }
    }

    const childSpeciesResult = this.getChildSpecies(parent1, parent2)
    if (!childSpeciesResult.success) {
      errors.concat(childSpeciesResult.errors)
      return { success: false, errors }
    }

    const childSpeciesError = this.checkChild(child, childSpeciesResult.species)
    if (childSpeciesError) {
      errors.push(childSpeciesError)
    }

    if (errors.length > 0) {
      return { success: false, errors }
    }

    return { success: true, species: childSpeciesResult.species }
  }

  private checkChild(
    child: PokemonNode,
    childSpecies: PokemonSpecies,
  ): BreedError | null {
    if (!child.isRootNode()) {
      return child.species?.id === childSpecies.id
        ? new BreedError(BreedErrorKind.ChildDidNotChange)
        : null
    }

    // Handle root node cases
    if (child.species?.isGenderless()) {
      const evolutionTree = child.species!.getEvolutionTree(
        this.pokemonEvolutions,
      )
      return evolutionTree.includes(childSpecies.id)
        ? null
        : new BreedError(BreedErrorKind.RootNodeSpeciesMismatch)
    }

    return child.species?.id === childSpecies.id
      ? null
      : new BreedError(BreedErrorKind.RootNodeSpeciesMismatch)
  }

  private checkEggGroups(
    parent1: PokemonNode,
    parent2: PokemonNode,
  ): BreedError | null {
    if (parent1.species?.isDitto() || parent2.species?.isDitto()) {
      return null
    }

    const eggGroupsMatch = parent1
      .species!.eggGroups.filter(Boolean)
      .some((eggGroup) =>
        parent2.species!.eggGroups.filter(Boolean).includes(eggGroup),
      )

    if (!eggGroupsMatch) {
      return new BreedError(BreedErrorKind.EggGroupCompatibility)
    }

    return null
  }

  private checkGenders(
    parent1: PokemonNode,
    parent2: PokemonNode,
  ): BreedError | null {
    if (parent1.species?.isGenderless() && parent2.species?.isGenderless()) {
      return null
    }

    if (parent1.gender === parent2.gender) {
      return new BreedError(BreedErrorKind.GenderCompatibility)
    }

    return null
  }

  private checkGenderless(
    parent1: PokemonNode,
    parent2: PokemonNode,
  ): BreedError | null {
    const isDitto1 = parent1.species?.isDitto()
    const isDitto2 = parent2.species?.isDitto()
    const isGenderless1 = parent1.species?.isGenderless()
    const isGenderless2 = parent2.species?.isGenderless()

    // Early return if neither parent is genderless
    if (!isGenderless1 && !isGenderless2) {
      return null
    }

    // Handle Ditto cases
    if (isDitto1 && isDitto2) {
      return new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
    }
    if ((isDitto1 && !isDitto2) || (isDitto2 && !isDitto1)) {
      return null
    }

    // Handle non-Ditto genderless cases
    if (isGenderless1) {
      const evolutionTree = parent1.species!.getEvolutionTree(
        this.pokemonEvolutions,
      )
      return evolutionTree.includes(parent2.species!.id)
        ? null
        : new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
    }

    const evolutionTree = parent2.species!.getEvolutionTree(
      this.pokemonEvolutions,
    )
    return evolutionTree.includes(parent1.species!.id)
      ? null
      : new BreedError(BreedErrorKind.GenderlessSpeciesCompatibility)
  }

  private getBaseSpecies(p: PokemonSpecies): PokemonSpecies {
    const id = p.getBaseEvolutionId(this.pokemonEvolutions)
    const raw = this.pokemonSpeciesRaw.find((p) => p.id === id)

    assert(raw !== undefined, "Pokemon Base evolution Species not found")

    return PokemonSpecies.parse(raw)
  }

  private getChildSpecies(
    parent1: PokemonNode,
    parent2: PokemonNode,
  ): BreedResult {
    if (parent1.species?.isDitto()) {
      return {
        success: true,
        species: this.getBaseSpecies(parent2.species!),
      }
    }

    if (parent2.species?.isDitto()) {
      return {
        success: true,
        species: this.getBaseSpecies(parent1.species!),
      }
    }

    if (parent1.species?.isGenderless() && parent2.species?.isGenderless()) {
      // both parents are correctly in the same GenderlessEvolutionTree because this function should run after checkGenderless()
      return { success: true, species: this.getBaseSpecies(parent1.species) }
    }

    const female =
      parent1.gender === PokemonGender.Female
        ? parent1
        : parent2.gender === PokemonGender.Female
          ? parent2
          : null

    if (female) {
      return { success: true, species: this.getBaseSpecies(female.species!) }
    }

    return {
      success: false,
      errors: [new BreedError(BreedErrorKind.GenderCompatibility)],
    }
  }
}
