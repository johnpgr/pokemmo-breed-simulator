"use client"
import { PokemonSpeciesUnparsed } from "@/core/pokemon"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { useBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import React from "react"
import { PokemonIvColors } from "./PokemonIvColors"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { usePokemonToBreed } from "./PokemonToBreedContext"

import { Button } from "./ui/button"

import { BreedError, BreedErrorKind, PokemonBreeder } from "@/core/breed"

export function PokemonBreedTree(props: { pokemons: PokemonSpeciesUnparsed[] }) {
    const ctx = usePokemonToBreed()
    if (!ctx.pokemon) {
        return null
    }

    return <PokemonBreedTreeFinal pokemons={props.pokemons} />
}

function PokemonBreedTreeFinal(props: { pokemons: PokemonSpeciesUnparsed[] }) {
    const ctx = usePokemonToBreed()
    assert.exists(ctx.pokemon, "Pokemon must be defined in useBreedMap")

    const desired31IvCount = Object.values(ctx.ivs).filter(Boolean).length
    const breeder = React.useMemo(() => new PokemonBreeder(), [])
    const [breedTreeMap, setBreedTreeMap] = useBreedTreeMap({
        finalPokemonNode: PokemonBreedTreeNode.ROOT(ctx),
        finalPokemonIvMap: ctx.ivs,
        desired31Ivcount: desired31IvCount,
    })

    React.useEffect(() => {
        const lastRow = ctx.nature ? desired31IvCount : desired31IvCount - 1
        const rowLength = Math.pow(2, lastRow)
        let changed = false

        //inc by 2 because we only want to breed() on one parent
        for (let col = 0; col < rowLength; col += 2) {
            const pos = new PokemonBreedTreePosition(lastRow, col)
            let node = breedTreeMap[pos.key()]
            let partnerNode = node?.getPartnerNode(breedTreeMap)

            const walkTreeBranch = () => {
                node = node?.getChildNode(breedTreeMap)
                partnerNode = node?.getPartnerNode(breedTreeMap)
            }

            while (node && partnerNode) {
                if (!node.gender || !partnerNode.gender || !node.species || !partnerNode.species) {
                    break
                }

                const childNode = node.getChildNode(breedTreeMap)
                if (!childNode) {
                    break
                }

                const breedResult = breeder.breed(node, partnerNode, childNode)

                if (breedResult instanceof BreedError) {
                    if (breedResult.kind === BreedErrorKind.ChildDidNotChange || breedResult.kind === BreedErrorKind.IllegalNodePosition) {
                        walkTreeBranch()
                        continue
                    }

                    node.breedError = breedResult
                    partnerNode.breedError = breedResult
                    break
                }

                childNode.species = breedResult
                node.breedError = undefined
                partnerNode.breedError = undefined
                changed = true
                walkTreeBranch()
            }
        }

        if (changed) {
            setBreedTreeMap({ ...breedTreeMap })
        }
    }, [breedTreeMap, breeder, ctx.nature, desired31IvCount, setBreedTreeMap])

    return (
        <div className="flex flex-col-reverse items-center gap-8 pb-16">
            {Array.from({ length: ctx.nature ? desired31IvCount + 1 : desired31IvCount }).map((_, row) => {
                const rowLength = Math.pow(2, row)

                return (
                    <div
                        key={`row:${row}`}
                        className="flex w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl items-center justify-center"
                    >
                        {Array.from({ length: rowLength }).map((_, col) => {
                            const position = new PokemonBreedTreePosition(row, col)

                            return (
                                <PokemonNodeLines
                                    key={`node:${position.key()}`}
                                    position={position}
                                    breedTree={breedTreeMap}
                                    rowLength={rowLength}
                                >
                                    <PokemonNodeSelect
                                        pokemons={props.pokemons}
                                        position={position}
                                        breedTree={breedTreeMap}
                                        setBreedTree={setBreedTreeMap}
                                    />
                                </PokemonNodeLines>
                            )
                        })}
                    </div>
                )
            })}
            {process.env.NODE_ENV === "development" ? (
                <div className="space-x-4">
                    <Button size={"sm"} onClick={() => console.log(breedTreeMap)}>
                        Debug (Breed Tree)
                    </Button>
                    <Button size={"sm"} onClick={() => console.log(ctx)}>
                        Debug (Context)
                    </Button>
                </div>
            ) : null}
            <PokemonIvColors />
        </div>
    )
}
