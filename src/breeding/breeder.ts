import { raise } from "@/lib/utils"
import type { BreedNode, GenderType, Position } from "./types"
import { Gender } from "./consts"
import { genderlessEggtypes, parsePosition } from "./utils"
import { Pokemon } from "@/data/types"

type BreedNodeAndPosition = {
  position: Position
  breedNode: BreedNode
}

export enum BreedErrorKind {
  GenderCompatibility = "GenderCompatibility",
  EggTypeCompatibility = "EggTypeCompatibility",
  NoPokemon = "NoPokemon",
  UnknownError = "UnknownError",
}

export class BreedError {
  constructor(
    public kind: BreedErrorKind,
    public positions: Array<Position>,
  ) {}
}

export class Breeder {
  private pokemon?: BreedNodeAndPosition
  private partner?: BreedNodeAndPosition

  constructor(private readonly getNodeFromPosition: (position: Position) => BreedNode | undefined) {}

  public setBreeders(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition) {
    this.pokemon = pokemon
    this.partner = partner
  }

  public tryBreed(): BreedNodeAndPosition | BreedError {
    if (!this.pokemon || !this.partner) throw new BreedError(BreedErrorKind.NoPokemon, [])
    this.checkBreedability(this.pokemon, this.partner)

    const child = this.getBreedChildSpecies(this.pokemon, this.partner)
    const childPosition = this.getChildPosition(this.pokemon, this.partner)
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

  private checkBreedability(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition) {
    this.genderCompatibility(pokemon, partner)
    this.eggTypeCompatibility(pokemon, partner)
  }

  private eggTypeCompatibility(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition) {
    const compatible = pokemon.breedNode.pokemon?.eggTypes.some((e) => partner.breedNode.pokemon?.eggTypes.includes(e))
    if (!compatible) throw new BreedError(BreedErrorKind.EggTypeCompatibility, [pokemon.position, partner.position])
  }

  private genderCompatibility(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition) {
    if (pokemon.breedNode.gender === partner.breedNode.gender)
      throw new BreedError(BreedErrorKind.GenderCompatibility, [pokemon.position, partner.position])
  }

  private getBreedChildSpecies(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition): Pokemon {
    const pokes = [pokemon.breedNode, partner.breedNode].filter((p) => p.gender === Gender.FEMALE)
    if (pokes.length !== 1) {
      raise("Error getting Breed Child Species")
    }
    return pokes[0].pokemon ?? raise("Error getting Breed Child Species")
  }

  private getChildPosition(pokemon: BreedNodeAndPosition, partner: BreedNodeAndPosition): Position {
    const parent1Position = parsePosition(pokemon.position)
    const parent2Position = parsePosition(partner.position)
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
