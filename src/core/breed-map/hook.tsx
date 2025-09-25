import React from "react"
import { PokemonNode } from "./node"
import { PokemonIvSet } from "./ivset"
import type { PokemonBreedMap } from "."
import { assert } from "@/lib/utils"
import { LASTROW_MAPPING } from "./utils"
import { PokemonBreederKind } from "../pokemon"
import { PokemonBreedMapPosition } from "./position"

export function usePokemonBreedMap() {
  const [map, setMap] = React.useState<PokemonBreedMap>({
    "0,0": PokemonNode.ROOT({ ivs: PokemonIvSet.DEFAULT }),
  })
  const rootNode = map["0,0"]

  function initialize() {
    const target = rootNode
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
      LASTROW_MAPPING[desired31IvCount]!
    const lastRowBreedersPositions = natured
      ? lastRowBreeders.natured
      : lastRowBreeders.natureless

    // initialize last row
    for (const [k, v] of Object.entries(lastRowBreedersPositions)) {
      switch (v) {
        case PokemonBreederKind.Nature: {
          const position = PokemonBreedMapPosition.fromKey(k)

          let node = map[position.key]
          if (!node) {
            node = new PokemonNode({ position })
            map[position.key] = node
          }
          node.nature = target.nature
          break
        }
        default: {
          const position = PokemonBreedMapPosition.fromKey(k)
          const ivs = PokemonIvSet.fromArray(target.ivs).get(v)
          assert(ivs, "Ivs should exist for last row breeders")

          let node = map[position.key]
          if (!node) {
            node = new PokemonNode({ position })
            map[position.key] = node
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
        let node = map[position.key]
        if (!node) {
          node = new PokemonNode({ position })
          map[position.key] = node
        }

        const parentNodes = node.getParentNodes(map)
        assert(
          parentNodes,
          `Parent nodes should exist for node: ${node.position.key}`,
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