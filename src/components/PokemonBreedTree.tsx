"use client"
import React from "react"
import { usePokemonToBreed } from "./PokemonToBreedContext"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { assert } from "@/lib/assert"
import { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { IvColors } from "./IvColors"
import { useBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { PokemonNodeLines } from "./PokemonNodeLines"

export function PokemonBreedTree() {
    const ctx = usePokemonToBreed()
    if (!ctx.pokemon) {
        return null
    }

    return <_PokemonBreedTree />
}

function _PokemonBreedTree() {
    const ctx = usePokemonToBreed()

    const generations = Object.values(ctx.ivs).filter(Boolean).length
    assert.exists(ctx.pokemon, "Pokemon must be defined in useBreedMap")

    const [breedTreeMap, setBreedTreeMap] = useBreedTreeMap({
        finalPokemonNode: PokemonBreedTreeNode.ROOT(ctx),
        finalPokemonIvMap: ctx.ivs,
        generations,
    })

    React.useEffect(() => {
        console.log("breedTreeMap changed")
    }, [breedTreeMap])

    // const [lastPositionChange, setLastPositionChange] = React.useState<PokemonBreedTreePosition[]>()
    // FIX: This is not a very good design, change this Breeder to not depend directly to the breedTreeMap reference
    // const breeder = React.useMemo(() => new Breeder(pokemonBreedTreeMap), [pokemonBreedTreeMap])

    return (
        <div className="flex flex-col-reverse items-center gap-8">
            {Array.from({ length: generations }).map((_, row) => {
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
                                    isError={false}
                                >
                                    <PokemonNodeSelect
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
            <IvColors />
        </div>
    )
}
