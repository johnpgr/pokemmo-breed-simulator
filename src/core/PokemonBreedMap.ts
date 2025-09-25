"use client"
import {
  PokemonBreederKind,
  PokemonGender,
  ZPokemonGender,
  PokemonIv,
  ZPokemonIv,
  PokemonNature,
  ZPokemonNature,
  PokemonSpecies,
  PokemonSpeciesRaw,
} from "@/core/pokemon"
import { assert } from "@/lib/assert"
import React from "react"
import { z } from "zod"
import { PokemonIvSet } from "./PokemonIvSet"

type PokemonBreedTreeRowMapped = Record<
  PokemonBreedMapPositionKey,
  PokemonBreederKind
>
export type PokemonBreedMapPositionKey = string
export class PokemonBreedMapPosition {
  constructor(
    public row: number,
    public col: number,
  ) {}

  public key(): PokemonBreedMapPositionKey {
    return `${this.row},${this.col}`
  }

  static fromKey(key: PokemonBreedMapPositionKey): PokemonBreedMapPosition {
    const [row, col] = key.split(",").map(Number)
    assert(row !== undefined, "Tried to make a key from invalid string")
    assert(col !== undefined, "Tried to make a key from invalid string")
    assert(!isNaN(row) && !isNaN(col), "Invalid BreedTreeNode key")

    return new PokemonBreedMapPosition(row, col)
  }

  /**
   * This type represents what the last row of pokemon iv's should be, depending on the nr of generations
   */
  static readonly LASTROW_MAPPING: Record<
    number,
    {
      natured: PokemonBreedTreeRowMapped
      natureless: PokemonBreedTreeRowMapped
    }
  > = {
    2: {
      natured: {
        [new PokemonBreedMapPosition(2, 0).key()]: PokemonBreederKind.Nature,
        [new PokemonBreedMapPosition(2, 1).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(2, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(2, 3).key()]: PokemonBreederKind.B,
      },
      natureless: {
        [new PokemonBreedMapPosition(1, 0).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(1, 1).key()]: PokemonBreederKind.B,
      },
    },
    3: {
      natured: {
        [new PokemonBreedMapPosition(3, 0).key()]: PokemonBreederKind.Nature,
        [new PokemonBreedMapPosition(3, 1).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(3, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(3, 3).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(3, 4).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(3, 5).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(3, 6).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(3, 7).key()]: PokemonBreederKind.B,
      },
      natureless: {
        [new PokemonBreedMapPosition(2, 0).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(2, 1).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(2, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(2, 3).key()]: PokemonBreederKind.C,
      },
    },
    4: {
      natured: {
        [new PokemonBreedMapPosition(4, 0).key()]: PokemonBreederKind.Nature,
        [new PokemonBreedMapPosition(4, 1).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 3).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 4).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 5).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 6).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 7).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 8).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 9).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 10).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 11).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 12).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 13).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 14).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 15).key()]: PokemonBreederKind.D,
      },
      natureless: {
        [new PokemonBreedMapPosition(3, 0).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(3, 1).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(3, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(3, 3).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(3, 4).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(3, 5).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(3, 6).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(3, 7).key()]: PokemonBreederKind.D,
      },
    },
    5: {
      natured: {
        [new PokemonBreedMapPosition(5, 0).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(5, 1).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(5, 3).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 4).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 5).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 6).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 7).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(5, 8).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 9).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 10).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 11).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(5, 12).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 13).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(5, 14).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 15).key()]: PokemonBreederKind.E,
        [new PokemonBreedMapPosition(5, 16).key()]: PokemonBreederKind.Nature,
        [new PokemonBreedMapPosition(5, 17).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 18).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 19).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 20).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 21).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 22).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 23).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(5, 24).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 25).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 26).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(5, 27).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(5, 28).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 29).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(5, 30).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(5, 31).key()]: PokemonBreederKind.E,
      },
      natureless: {
        [new PokemonBreedMapPosition(4, 0).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 1).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 2).key()]: PokemonBreederKind.A,
        [new PokemonBreedMapPosition(4, 3).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 4).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 5).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 6).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 7).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(4, 8).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 9).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 10).key()]: PokemonBreederKind.B,
        [new PokemonBreedMapPosition(4, 11).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(4, 12).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 13).key()]: PokemonBreederKind.D,
        [new PokemonBreedMapPosition(4, 14).key()]: PokemonBreederKind.C,
        [new PokemonBreedMapPosition(4, 15).key()]: PokemonBreederKind.E,
      },
    },
  }
}

export type PokemonCountByBreederKind = {
  kind: PokemonBreederKind
  count: { natured: number; natureless: number }
}[]

/**
 * Returns a list of pokemon counts grouped by breeder kind
 * This list is used to render the pokemon breed tree depending on the number of generations that is selected
 */
export function getPokemonCountByBreederKind(
  generations: number,
): PokemonCountByBreederKind {
  assert(generations >= 2 && generations <= 5, "Invalid generations number")
  const lastRowPositions = PokemonBreedMapPosition.LASTROW_MAPPING[generations]!
  const breederKinds = [
    PokemonBreederKind.A,
    PokemonBreederKind.B,
    PokemonBreederKind.C,
    PokemonBreederKind.D,
    PokemonBreederKind.E,
  ]
  const natured: PokemonBreederKind[] = Object.values(
    lastRowPositions.natured,
  ).filter((kind) => kind !== PokemonBreederKind.Nature)
  const natureless = Object.values(lastRowPositions.natureless)
  const naturedGroupped = Object.groupBy(natured, (kind) => kind)
  const naturelessGroupped = Object.groupBy(natureless, (kind) => kind)

  return breederKinds.map((kind) => ({
    kind,
    count: {
      natured: naturedGroupped[kind]?.length ?? 0,
      natureless: naturelessGroupped[kind]?.length ?? 0,
    },
  }))
}

export type PokemonBreedMap = Record<PokemonBreedMapPositionKey, PokemonNode>
export type PokemonBreedMapSerialized = Record<
  PokemonBreedMapPositionKey,
  ZPokemonNode
>

export function usePokemonBreedMap() {
  const [map, setMap] = React.useState<PokemonBreedMap>({
    "0,0": PokemonNode.ROOT({ ivs: PokemonIvSet.DEFAULT }),
  })
  const rootNode = () => map["0,0"]!

  function initialize() {
    const target = rootNode()
    assert(target.ivs !== undefined, "finalPokemonNode.ivs should exist")
    const desired31IvCount = target.ivs.filter(Boolean).length
    assert(
      desired31IvCount !== undefined &&
        desired31IvCount >= 2 &&
        desired31IvCount <= 5,
      "Invalid generations number",
    )
    const natured = Boolean(target.nature)
    const lastRowBreeders =
      PokemonBreedMapPosition.LASTROW_MAPPING[desired31IvCount]!
    const lastRowBreedersPositions = natured
      ? lastRowBreeders.natured
      : lastRowBreeders.natureless

    // initialize last row
    for (const [k, v] of Object.entries(lastRowBreedersPositions)) {
      switch (v) {
        case PokemonBreederKind.Nature: {
          const position = PokemonBreedMapPosition.fromKey(k)

          let node = map[position.key()]
          if (!node) {
            node = new PokemonNode({ position })
            map[position.key()] = node
          }
          node.nature = target.nature
          break
        }
        default: {
          const position = PokemonBreedMapPosition.fromKey(k)
          const ivs = PokemonIvSet.fromArray(target.ivs).get(v)
          assert(ivs, "Ivs should exist for last row breeders")

          let node = map[position.key()]
          if (!node) {
            node = new PokemonNode({ position })
            map[position.key()] = node
          }
          node.ivs = [ivs]
          break
        }
      }
    }

    // initialize the rest of the tree
    // start from the second to last row
    // stops on the first row where the final pokemon node is already set
    // -1 for natured because of the way POKEMON_BREEDTREE_LASTROW_MAPPING is defined
    let row = natured ? desired31IvCount - 1 : desired31IvCount - 2
    while (row > 0) {
      let col = 0
      while (col < Math.pow(2, row)) {
        const position = new PokemonBreedMapPosition(row, col)
        let node = map[position.key()]
        if (!node) {
          node = new PokemonNode({ position })
          map[position.key()] = node
        }

        const parentNodes = node.getParentNodes(map)
        assert(
          parentNodes,
          `Parent nodes should exist for node: ${node.position.key()}`,
        )

        const p1Node = parentNodes[0]
        const p2Node = parentNodes[1]

        // calculate ivs and nature from parent nodes
        const ivs = [...new Set([...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])])]
        const nature = p1Node.nature ?? p2Node.nature ?? undefined

        node.nature = nature
        node.ivs = ivs

        col = col + 1
      }
      row = row - 1
    }
    setMap({ ...map })
  }

  return {
    map,
    setMap,
    rootNode,
    initialize,
  }
}

export type UsePokemonBreedMap = ReturnType<typeof usePokemonBreedMap>

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
    copy.species &&
      Object.setPrototypeOf(copy.species, PokemonSpecies.prototype)
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

    return map[childPosition.key()]
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

    return map[partnerPos.key()]
  }

  public getParentNodes(
    map: PokemonBreedMap,
  ): [PokemonNode, PokemonNode] | undefined {
    const parentRow = this.position.row + 1
    const parentCol = this.position.col * 2

    const parent1 = map[new PokemonBreedMapPosition(parentRow, parentCol).key()]
    const parent2 =
      map[new PokemonBreedMapPosition(parentRow, parentCol + 1).key()]

    if (!parent1 || !parent2) return undefined

    return [parent1, parent2]
  }

  public isRootNode(): boolean {
    return this.position.key() === "0,0"
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

export const ZBreedMap = z.record(z.string(), ZPokemonNode)
export type ZBreedMap = z.infer<typeof ZBreedMap>
