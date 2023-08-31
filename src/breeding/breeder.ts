import { raise } from "@/lib/utils"
import type { BreedNode, GenderType, Position } from "./types"
import { Gender } from "./consts"
import { genderlessEggtypes, parsePosition } from "./utils"
import { Pokemon } from "@/data/types"

type BreedNodeAndPosition = {
  position: Position
  breedNode: BreedNode
}

//TODO
export enum BreedErrorKind {
  GenderCompatibility,
  EggTypeCompatibility,
  UnknownError,
}

export class BreedError {
  constructor(
    public kind: BreedErrorKind,
    public positions: Array<Position>,
  ) {}
}

export class Breeder {
  constructor(
    private pokemon: BreedNodeAndPosition,
    private partner: BreedNodeAndPosition,
    private readonly getNodeFromPosition: (position: Position) => BreedNode | undefined,
  ) {}

  public changeBreeders(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition) {
    this.pokemon = pokemon
    this.partner = partner
  }

  public tryBreed(): BreedNodeAndPosition | BreedError {
    this.checkBreedability()

    const child = this.getBreedChildSpecies()
    const childPosition = this.getChildPosition()
    const childGender = this.getChildGender(child)
    const childNode = this.getNodeFromPosition(childPosition)

    return {
      breedNode: {
        pokemon: child,
        gender: childGender,
        parents: [this.pokemon.position, this.partner.position],
        ivs: childNode?.ivs ?? null,
        nature: childNode?.nature ?? null,
      },
      position: childPosition,
    }
  }

  private checkBreedability() {
    this.genderCompatibility()
    this.eggTypeCompatibility()
  }

  private eggTypeCompatibility() {
    const compatible = this.pokemon.breedNode.pokemon?.eggTypes.some(
      (e) => this.partner.breedNode.pokemon?.eggTypes.includes(e),
    )
    if (!compatible)
      throw new BreedError(BreedErrorKind.EggTypeCompatibility, [this.pokemon.position, this.partner.position])
  }

  private genderCompatibility() {
    if (this.pokemon.breedNode.gender === this.partner.breedNode.gender)
      throw new BreedError(BreedErrorKind.GenderCompatibility, [this.pokemon.position, this.partner.position])
  }

  private getBreedChildSpecies(): Pokemon {
    const pokes = [this.pokemon.breedNode, this.partner.breedNode].filter((p) => p.gender === Gender.FEMALE)
    if (pokes.length !== 1) {
      raise("Error getting Breed Child Species")
    }
    return pokes[0].pokemon ?? raise("Error getting Breed Child Species")
  }

  private getChildPosition(): Position {
    const parent1Position = parsePosition(this.pokemon.position)
    const parent2Position = parsePosition(this.partner.position)
    const childRow = parent1Position.row - 1
    const childCol = Math.floor((parent1Position.col + parent2Position.col) / 2)
    const childPosition = `${childRow},${childCol}`
    return childPosition as Position
  }

  private getChildGender(child: Pokemon): GenderType {
    if (child.eggTypes.some((e) => genderlessEggtypes.includes(e))) {
      return null
    }
    return Math.random() * 100 > child.percentageMale ? Gender.FEMALE : Gender.MALE
  }
}
