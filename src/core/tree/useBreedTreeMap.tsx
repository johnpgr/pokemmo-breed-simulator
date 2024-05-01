import React from "react"
import { run } from "@/lib/utils"
import { PokemonBreedTreeNode } from "./BreedTreeNode"
import type { IVSet } from "@/components/PokemonToBreedContext"
import { assert } from "@/lib/assert"
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from "../consts"
import { PokemonBreederKind } from "../pokemon"
import { PokemonBreedTreePosition } from "./BreedTreePosition"

export type BreedTreePositionKey = string
export type PokemonBreedTreeMap = Record<BreedTreePositionKey, PokemonBreedTreeNode>

export function useBreedTreeMap(props: {
    finalPokemonNode: PokemonBreedTreeNode
    finalPokemonIvMap: IVSet
    generations: number
}) {
    const { finalPokemonNode, finalPokemonIvMap, generations } = props

    return React.useState<PokemonBreedTreeMap>(
        run(() => {
            const map: PokemonBreedTreeMap = {}
            map[finalPokemonNode.position.key()] = finalPokemonNode

            const natured = Boolean(finalPokemonNode.nature)

            assert.exists(finalPokemonNode.ivs, "finalPokemonNode.ivs should exist")
            assert([2, 3, 4, 5].includes(generations), "Invalid generations number")

            const lastRowBreeders =
                POKEMON_BREEDTREE_LASTROW_MAPPING[generations as keyof typeof POKEMON_BREEDTREE_LASTROW_MAPPING]
            const lastRowBreedersPositions = natured ? lastRowBreeders.natured : lastRowBreeders.natureless

            // initialize last row
            for (const [k, v] of lastRowBreedersPositions.entries()) {
                switch (v) {
                    case PokemonBreederKind.Nature: {
                        const position = PokemonBreedTreePosition.fromKey(k)
                        map[position.key()] = new PokemonBreedTreeNode(
                            position,
                            undefined,
                            undefined,
                            finalPokemonNode.nature,
                            undefined,
                        )

                        break
                    }
                    default: {
                        const position = PokemonBreedTreePosition.fromKey(k)
                        const ivs = finalPokemonIvMap.get(v)
                        assert.exists(ivs, "Ivs should exist for last row breeders")

                        map[position.key()] = new PokemonBreedTreeNode(position, undefined, undefined, undefined, [ivs])

                        break
                    }
                }
            }

            // initialize the rest of the tree
            // start from the second to last row
            // stops on the first row where the final pokemon node is already set
            let row = generations - 2
            while (row > 0) {
                let col = 0
                while (col < Math.pow(2, row)) {
                    const pos = new PokemonBreedTreePosition(row, col)
                    const node = new PokemonBreedTreeNode(pos, undefined, undefined, undefined, undefined)

                    const parentNodes = node.getParentNodes(map)
                    assert.exists(parentNodes, "Parent nodes should exist")

                    const p1Node = parentNodes[0]
                    const p2Node = parentNodes[1]

                    // calculate ivs and nature from parent nodes
                    const ivs = [...new Set([...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])])]
                    const nature = p1Node.nature ?? p2Node.nature ?? undefined

                    node.nature = nature
                    node.ivs = ivs
                    map[pos.key()] = node

                    col = col + 1
                }
                row = row - 1
            }

            return map
        }),
    )
}
