import type { IVSet } from "@/components/PokemonBreedTreeContext"
import { assert } from "@/lib/assert"
import React from "react"
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from "../consts"
import { PokemonBreederKind, PokemonSpecies, PokemonSpeciesUnparsed } from "../pokemon"
import { PokemonBreedTreeNode, PokemonBreedTreeNodeSerialized } from "./BreedTreeNode"
import { PokemonBreedTreePosition } from "./BreedTreePosition"

export type PokemonBreedTreePositionKey = string
export type PokemonBreedTreeMap = Record<PokemonBreedTreePositionKey, PokemonBreedTreeNode>
export type PokemonBreedTreeMapSerialized = Record<PokemonBreedTreePositionKey, PokemonBreedTreeNodeSerialized>

export function useBreedTreeMap(props: {
    finalPokemonNode: PokemonBreedTreeNode
    finalPokemonIvSet: IVSet
    desired31IvCount: number
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
}) {
    const [hasImported, setHasImported] = React.useState(false)
    const [breedTreeMap, setBreedTreeMap] = React.useState<PokemonBreedTreeMap>(() =>
        init(props.finalPokemonNode, props.finalPokemonIvSet, props.desired31IvCount),
    )

    function init(
        finalPokemonNode: PokemonBreedTreeNode,
        finalPokemonIvSet: IVSet,
        desired31Ivcount: number,
    ): PokemonBreedTreeMap {
        const map: PokemonBreedTreeMap = {}
        map[finalPokemonNode.position.key()] = finalPokemonNode

        const natured = Boolean(finalPokemonNode.nature)

        assert.exists(finalPokemonNode.ivs, "finalPokemonNode.ivs should exist")
        assert([2, 3, 4, 5].includes(desired31Ivcount), "Invalid generations number")

        const lastRowBreeders =
            POKEMON_BREEDTREE_LASTROW_MAPPING[desired31Ivcount as keyof typeof POKEMON_BREEDTREE_LASTROW_MAPPING]
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
                    const ivs = finalPokemonIvSet.get(v)
                    assert.exists(ivs, "Ivs should exist for last row breeders")

                    map[position.key()] = new PokemonBreedTreeNode(position, undefined, undefined, undefined, [ivs])

                    break
                }
            }
        }

        // initialize the rest of the tree
        // start from the second to last row
        // stops on the first row where the final pokemon node is already set
        // -1 for natured because of the way POKEMON_BREEDTREE_LASTROW_MAPPING is defined
        let row = natured ? desired31Ivcount - 1 : desired31Ivcount - 2
        while (row > 0) {
            let col = 0
            while (col < Math.pow(2, row)) {
                const pos = new PokemonBreedTreePosition(row, col)
                const node = new PokemonBreedTreeNode(pos, undefined, undefined, undefined, undefined)

                const parentNodes = node.getParentNodes(map)
                assert.exists(parentNodes, `Parent nodes should exist for node: ${node.position.key()}`)

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
    }

    function serialize(): PokemonBreedTreeMapSerialized {
        const exported: PokemonBreedTreeMapSerialized = {}
        for (const [key, node] of Object.entries(breedTreeMap)) {
            exported[key] = node.exportNode()
        }
        return exported
    }

    function deserialize(serializedTreeMap?: PokemonBreedTreeMapSerialized) {
        if (!serializedTreeMap) {
            return
        }

        if (hasImported) {
            return
        }

        const breedTreeMapCopy = { ...breedTreeMap }

        for (const [pos, value] of Object.entries(serializedTreeMap)) {
            const node = breedTreeMapCopy[pos]
            assert.exists(node, "Failed to import breed tree. Exported tree contains invalid position.")

            const unparsedSpecies = props.pokemonSpeciesUnparsed.find((p) => p.number === value.species)
            if (unparsedSpecies) {
                const species = PokemonSpecies.parse(unparsedSpecies)
                node.species = species
            }

            node.nickname = value.nickname
            node.gender = value.gender
        }

        setBreedTreeMap(breedTreeMapCopy)
        setHasImported(true)
    }

    return {
        breedTreeMap,
        setBreedTreeMap,
        serialize,
        deserialize,
        hasImported,
        setHasImported,
    } as const
}
