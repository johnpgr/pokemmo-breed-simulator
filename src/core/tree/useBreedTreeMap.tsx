import type { IVSet } from "@/core/ctx/PokemonBreedTreeContext"
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
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
}) {
    const desired31IvCount = React.useMemo(
        () => Object.values(props.finalPokemonIvSet).filter(Boolean).length,
        [props.finalPokemonIvSet],
    )
    const [map, setMap] = React.useState<PokemonBreedTreeMap>({})

    function init(finalPokemonNode: PokemonBreedTreeNode, finalPokemonIvSet: IVSet, desired31Ivcount: number) {
        const _map: PokemonBreedTreeMap = {}
        _map[finalPokemonNode.position.key()] = finalPokemonNode

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
                    _map[position.key()] = new PokemonBreedTreeNode({ nature: finalPokemonNode.nature, position })

                    break
                }
                default: {
                    const position = PokemonBreedTreePosition.fromKey(k)
                    const ivs = finalPokemonIvSet.get(v)
                    assert.exists(ivs, "Ivs should exist for last row breeders")

                    _map[position.key()] = new PokemonBreedTreeNode({ position, ivs: [ivs] })

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
                const position = new PokemonBreedTreePosition(row, col)
                const node = new PokemonBreedTreeNode({ position })

                const parentNodes = node.getParentNodes(_map)
                assert.exists(parentNodes, `Parent nodes should exist for node: ${node.position.key()}`)

                const p1Node = parentNodes[0]
                const p2Node = parentNodes[1]

                // calculate ivs and nature from parent nodes
                const ivs = [...new Set([...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])])]
                const nature = p1Node.nature ?? p2Node.nature ?? undefined

                node.setNature(nature).setIvs(ivs)
                _map[position.key()] = node

                col = col + 1
            }
            row = row - 1
        }

        setMap(_map)
    }

    function serialize(): PokemonBreedTreeMapSerialized {
        const exported: PokemonBreedTreeMapSerialized = {}
        for (const [key, node] of Object.entries(map)) {
            exported[key] = node.toSerialized()
        }
        return exported
    }

    function deserialize(serializedTreeMap: PokemonBreedTreeMapSerialized) {
        const breedTreeMapCopy = { ...map }

        if (Object.keys(breedTreeMapCopy).length < 1) {
            return
        }

        for (const [pos, value] of Object.entries(serializedTreeMap)) {
            const node = breedTreeMapCopy[pos]
            assert.exists(node, `Failed to import breed tree. Exported tree contains invalid position. (${pos})`)

            const unparsedSpecies = props.pokemonSpeciesUnparsed.find((p) => p.number === value.species)
            if (unparsedSpecies) {
                const species = PokemonSpecies.parse(unparsedSpecies)
                node.setSpecies(species)
            }

            node.setNickname(value.nickname).setGender(value.gender)
        }

        setMap(breedTreeMapCopy)
    }

    React.useEffect(() => {
        if (!props.finalPokemonNode.species) {
            return
        }

        if (Object.keys(map).length > 0) {
            return
        }

        init(props.finalPokemonNode, props.finalPokemonIvSet, desired31IvCount)
    }, [props.finalPokemonNode, props.finalPokemonIvSet, desired31IvCount, map])

    return {
        map,
        setMap,
        serialize,
        deserialize,
    } as const
}

export type UseBreedTreeMap = ReturnType<typeof useBreedTreeMap>
