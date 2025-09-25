import z from "zod"
import type { PokemonIvSet } from "./ivset"
import {
  ZPokemonIv,
  ZPokemonNature,
  ZPokemonGender,
  PokemonIv,
  PokemonSpecies,
  PokemonGender,
  PokemonNature,
} from "../pokemon"
import { PokemonBreedMapPosition } from "./position"
import type { PokemonBreedMap } from "."

export const ZPokemonNode = z.object({
  id: z.number().optional(),
  ivs: z.array(ZPokemonIv).optional(),
  nature: ZPokemonNature.optional(),
  gender: ZPokemonGender.optional(),
  nickname: z.string().optional(),
  genderCostIgnored: z.boolean().optional(),
})
export type ZPokemonNode = z.infer<typeof ZPokemonNode>

export class PokemonNode {
  position: PokemonBreedMapPosition
  ivs?: PokemonIv[] | undefined
  species?: PokemonSpecies | undefined
  gender?: PokemonGender | undefined
  nature?: PokemonNature | undefined
  nickname?: string | undefined
  genderCostIgnored?: boolean

  constructor(params: {
    position: PokemonBreedMapPosition
    species?: PokemonSpecies
    gender?: PokemonGender
    nature?: PokemonNature
    ivs?: PokemonIv[]
    nickname?: string
    genderCostIgnored?: boolean
  }) {
    this.position = params.position
    this.species = params.species
    this.gender = params.gender
    this.nature = params.nature
    this.ivs = params.ivs
    this.nickname = params.nickname
  }

  public clone(): this {
    const copy = structuredClone(this)
    Object.setPrototypeOf(copy, PokemonNode.prototype)
    Object.setPrototypeOf(copy.position, PokemonBreedMapPosition.prototype)
    if (copy.species) {
      Object.setPrototypeOf(copy.species, PokemonSpecies.prototype)
    }
    return copy
  }

  static EMPTY(pos: PokemonBreedMapPosition): PokemonNode {
    return new PokemonNode({ position: pos })
  }

  static ROOT(breedTarget: {
    species?: PokemonSpecies
    nature?: PokemonNature
    ivs: PokemonIvSet
  }): PokemonNode {
    return new PokemonNode({
      position: new PokemonBreedMapPosition(0, 0),
      species: breedTarget.species,
      ivs: breedTarget.ivs.toArray(),
      nature: breedTarget.nature,
    })
  }

  public serialize(rootNode?: boolean): ZPokemonNode {
    if (rootNode) {
      return {
        id: this.species?.id,
        ivs: this.ivs,
        nature: this.nature,
        gender: this.gender,
        nickname: this.nickname,
        genderCostIgnored: this.genderCostIgnored,
      }
    }
    return {
      id: this.species?.id,
      gender: this.gender,
      nickname: this.nickname,
      genderCostIgnored: this.genderCostIgnored,
    }
  }

  public getChildNode(map: PokemonBreedMap): PokemonNode | undefined {
    const childRow = this.position.row - 1
    const childCol = Math.floor(this.position.col / 2)
    const childPosition = new PokemonBreedMapPosition(childRow, childCol)

    return map[childPosition.key]
  }

  public getPartnerNode(map: PokemonBreedMap): PokemonNode | undefined {
    const partnerCol =
      (this.position.col & 1) === 0
        ? this.position.col + 1
        : this.position.col - 1
    const partnerPos = new PokemonBreedMapPosition(
      this.position.row,
      partnerCol,
    )

    return map[partnerPos.key]
  }

  public getParentNodes(
    map: PokemonBreedMap,
  ): [PokemonNode, PokemonNode] | undefined {
    const parentRow = this.position.row + 1
    const parentCol = this.position.col * 2

    const parent1 = map[new PokemonBreedMapPosition(parentRow, parentCol).key]
    const parent2 =
      map[new PokemonBreedMapPosition(parentRow, parentCol + 1).key]

    if (!parent1 || !parent2) return undefined

    return [parent1, parent2]
  }

  public isRootNode(): boolean {
    return this.position.key === "0,0"
  }

  public rollGender(): PokemonGender | undefined {
    if (this.species?.percentageMale === 0) {
      return PokemonGender.Female
    } else if (this.species?.percentageMale === 100) {
      return PokemonGender.Male
    } else if (this.species?.isGenderless()) {
      return PokemonGender.Genderless
    }
  }
}
