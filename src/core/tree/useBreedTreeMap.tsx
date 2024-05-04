import type { IVSet } from "@/components/PokemonToBreedContext"
import { assert } from "@/lib/assert"
import React from "react"
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from "../consts"
import { PokemonBreederKind } from "../pokemon"
import { PokemonBreedTreeNode } from "./BreedTreeNode"
import { PokemonBreedTreePosition } from "./BreedTreePosition"

export type BreedTreePositionKey = string
export type PokemonBreedTreeMap = Record<
    BreedTreePositionKey,
    PokemonBreedTreeNode
>

export function useBreedTreeMap(props: {
    finalPokemonNode: PokemonBreedTreeNode
    finalPokemonIvMap: IVSet
    desired31Ivcount: number
}) {
    return React.useState<PokemonBreedTreeMap>(() => {
        const map: PokemonBreedTreeMap = {}
        map[props.finalPokemonNode.position.key()] = props.finalPokemonNode

        const natured = Boolean(props.finalPokemonNode.nature)

        assert.exists(
            props.finalPokemonNode.ivs,
            "finalPokemonNode.ivs should exist",
        )
        assert(
            [2, 3, 4, 5].includes(props.desired31Ivcount),
            "Invalid generations number",
        )

        const lastRowBreeders =
            POKEMON_BREEDTREE_LASTROW_MAPPING[
                props.desired31Ivcount as keyof typeof POKEMON_BREEDTREE_LASTROW_MAPPING
            ]
        const lastRowBreedersPositions = natured
            ? lastRowBreeders.natured
            : lastRowBreeders.natureless

        // initialize last row
        for (const [k, v] of lastRowBreedersPositions.entries()) {
            switch (v) {
                case PokemonBreederKind.Nature: {
                    const position = PokemonBreedTreePosition.fromKey(k)
                    map[position.key()] = new PokemonBreedTreeNode(
                        position,
                        undefined,
                        undefined,
                        props.finalPokemonNode.nature,
                        undefined,
                    )

                    break
                }
                default: {
                    const position = PokemonBreedTreePosition.fromKey(k)
                    const ivs = props.finalPokemonIvMap.get(v)
                    assert.exists(ivs, "Ivs should exist for last row breeders")

                    map[position.key()] = new PokemonBreedTreeNode(
                        position,
                        undefined,
                        undefined,
                        undefined,
                        [ivs],
                    )

                    break
                }
            }
        }

        // initialize the rest of the tree
        // start from the second to last row
        // stops on the first row where the final pokemon node is already set
        // -1 for natured because of the way POKEMON_BREEDTREE_LASTROW_MAPPING is defined
        let row = natured
            ? props.desired31Ivcount - 1
            : props.desired31Ivcount - 2
        while (row > 0) {
            let col = 0
            while (col < Math.pow(2, row)) {
                const pos = new PokemonBreedTreePosition(row, col)
                const node = new PokemonBreedTreeNode(
                    pos,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                )

                const parentNodes = node.getParentNodes(map)
                assert.exists(
                    parentNodes,
                    `Parent nodes should exist for node: ${node.position.key()}`,
                )

                const p1Node = parentNodes[0]
                const p2Node = parentNodes[1]

                // calculate ivs and nature from parent nodes
                const ivs = [
                    ...new Set([...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])]),
                ]
                const nature = p1Node.nature ?? p2Node.nature ?? undefined

                node.nature = nature
                node.ivs = ivs
                map[pos.key()] = node

                col = col + 1
            }
            row = row - 1
        }

        return map
    })
}
