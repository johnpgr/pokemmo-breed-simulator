import { raise } from "@/lib/utils"
import type { BreedNode, GenderType, Position } from "./types"
import { Gender } from "./consts"
import { genderlessEggtypes, parsePosition } from "./utils"
import { Pokemon } from "@/data/types"

type BreedPokemonNode = {
  position: Position
  breedNode: BreedNode
}

export class Breeder {
  constructor(
    private poke1: BreedPokemonNode,
    private poke2: BreedPokemonNode,
  ) {}

  public breed(): BreedNode & { position: Position } {
    const compatible = this.checkBreedability()

    if (!compatible) {
      this.breedError(this.poke1.position, this.poke2.position)
    }

    const child = this.getBreedChildSpecies()
    const childPosition = this.getChildPosition()
    //TODO:
    const childGender = this.getChildGender(child)

    return {
      pokemon: child,
      gender: childGender,
      parents: [this.poke1.position, this.poke2.position],
      position: childPosition,
    }
  }
  private checkBreedability(): boolean {
    const genderCompatible = this.genderCompatibility()
    const eggTypeCompatible = this.eggTypeCompatibility()

    if (!genderCompatible || !eggTypeCompatible) {
      return false
    }

    return true
  }
  private eggTypeCompatibility(): boolean {
    const compatible = this.poke1.breedNode.pokemon.eggTypes.some((e) =>
      this.poke2.breedNode.pokemon.eggTypes.includes(e),
    )

    return compatible
  }
  private genderCompatibility(): boolean {
    if (this.poke1.breedNode.gender === this.poke2.breedNode.gender) {
      return false
    }

    return true
  }
  private getBreedChildSpecies(): Pokemon {
    const pokes = [this.poke1.breedNode, this.poke2.breedNode].filter(
      (p) => p.gender === Gender.FEMALE,
    )

    if (pokes.length !== 1) {
      raise("This shouldn not happen")
    }

    return pokes[0].pokemon
  }
  private getChildPosition(): Position {
    const parent1Position = parsePosition(this.poke1.position)
    const parent2Position = parsePosition(this.poke2.position)
    const childRow = parent1Position.row - 1
    const childCol = Math.floor((parent1Position.col + parent2Position.col) / 2)
    const childPosition = `${childRow}-${childCol}`

    return childPosition as Position
  }
  private getChildGender(child: Pokemon): GenderType {
    if (child.eggTypes.some((e) => genderlessEggtypes.includes(e))) {
      return null
    }

    return Math.random() * 100 > child.percentageMale
      ? Gender.FEMALE
      : Gender.MALE
  }
  private breedError(pos1: Position, pos2: Position): never {
    raise("Not implemented.")
  }
}
