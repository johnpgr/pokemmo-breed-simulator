"use client"
import * as PokemonBreed from "@/core/breed"
import { PokemonGender, PokemonSpecies, PokemonSpeciesUnparsed } from "@/core/pokemon"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import {
    PokemonBreedTreePositionKey,
    useBreedTreeMap,
} from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import React from "react"
import { toast } from "sonner"
import { PokemonIvColors } from "./PokemonIvColors"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { usePokemonToBreed } from "./PokemonToBreedContext"
import { Button } from "./ui/button"

export type BreedErrors = Record<
    PokemonBreedTreePositionKey,
    Set<PokemonBreed.BreedError> | undefined
>

export function PokemonBreedTree(props: {
    pokemons: PokemonSpeciesUnparsed[]
}) {
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
    const [breedTreeMap, setBreedTreeMap] = useBreedTreeMap({
        finalPokemonNode: PokemonBreedTreeNode.ROOT(ctx),
        finalPokemonIvMap: ctx.ivs,
        desired31Ivcount: desired31IvCount,
    })
    const [breedErrors, setBreedErrors] = React.useState<BreedErrors>({})

    function deleteErrors(pos: PokemonBreedTreePositionKey) {
        setBreedErrors((prev) => {
            delete prev[pos]
            return { ...prev }
        })
    }

    function addErrors(pos: PokemonBreedTreePositionKey, errors: Set<PokemonBreed.BreedError>) {
        setBreedErrors((prev) => {
            prev[pos] = errors
            return { ...prev }
        })
    }

    React.useEffect(() => {
        Object.entries(breedErrors).map(([key, errorKind]) => {
            if (!errorKind) {
                return
            }

            const poke = breedTreeMap[key]
            if (!poke?.species) {
                return
            }

            const partner = poke.getPartnerNode(breedTreeMap)
            if (!partner?.species) {
                return
            }

            let errorMsg = ""
            for (const error of errorKind.values()) {
                errorMsg += error
                errorMsg += ", "
            }

            if (errorMsg.endsWith(", ")) {
                errorMsg = errorMsg.slice(0, -2)
            }

            toast.error(
                `${poke.species.name} cannot breed with ${partner.species.name}.`,
                {
                    description: `Error codes: ${errorMsg}`,
                    action: {
                        label: "Dismiss",
                        onClick: () => { },
                    },
                },
            )
        })
    }, [breedErrors])

    React.useEffect(() => {
        const lastRow = ctx.nature ? desired31IvCount : desired31IvCount - 1
        const rowLength = Math.pow(2, lastRow)
        let changed = false

        //inc by 2 because we only want to breed() on one parent
        for (let col = 0; col < rowLength; col += 2) {
            const pos = new PokemonBreedTreePosition(lastRow, col)
            let node = breedTreeMap[pos.key()]
            let partnerNode = node?.getPartnerNode(breedTreeMap)

            function next() {
                node = node?.getChildNode(breedTreeMap)
                partnerNode = node?.getPartnerNode(breedTreeMap)
            }

            while (node && partnerNode) {
                // bind the current node position because walkTreeBranch()
                // will move the node pointer before the errors are set
                const currentNodePos = node.position.key()

                if (
                    !node.gender ||
                    !partnerNode.gender ||
                    !node.species ||
                    !partnerNode.species
                ) {
                    if (breedErrors[pos.key()]) {
                        deleteErrors(currentNodePos)
                    }
                    break
                }

                const childNode = node.getChildNode(breedTreeMap)
                if (!childNode) {
                    break
                }

                const breedResult = PokemonBreed.breed(
                    node,
                    partnerNode,
                    childNode,
                )

                if (!(breedResult instanceof PokemonSpecies)) {
                    if (breedResult.has(
                        PokemonBreed.BreedError.ChildDidNotChange,
                    )) {
                        deleteErrors(currentNodePos)
                        next()
                        continue
                    }

                    addErrors(currentNodePos, breedResult)
                    break
                }

                changed = true
                childNode.species = breedResult
                if (childNode.species.percentageMale === 0) {
                    childNode.gender = PokemonGender.Female
                } else if (childNode.species.percentageMale === 100) {
                    childNode.gender = PokemonGender.Male
                } else if (childNode.isGenderless()) {
                    childNode.gender = PokemonGender.Genderless
                }
                deleteErrors(currentNodePos)
                next()
            }
        }

        if (changed) {
            setBreedTreeMap({ ...breedTreeMap })
        }
    }, [breedTreeMap, ctx.nature, desired31IvCount, setBreedTreeMap, setBreedErrors])

    return (
        <div className="flex flex-col-reverse items-center gap-8 pb-16">
            {Array.from({
                length: ctx.nature ? desired31IvCount + 1 : desired31IvCount,
            }).map((_, row) => {
                const rowLength = Math.pow(2, row)

                return (
                    <div
                        key={`row:${row}`}
                        className="flex w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl items-center justify-center"
                    >
                        {Array.from({ length: rowLength }).map((_, col) => {
                            const position = new PokemonBreedTreePosition(
                                row,
                                col,
                            )

                            return (
                                <PokemonNodeLines
                                    key={`node:${position.key()}`}
                                    position={position}
                                    rowLength={rowLength}
                                    breedTree={breedTreeMap}
                                    breedErrors={breedErrors}
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
                    <Button
                        variant={"secondary"}
                        size={"sm"}
                        onClick={() => console.log(breedTreeMap)}
                    >
                        Debug (Breed Tree)
                    </Button>
                    <Button
                        variant={"secondary"}
                        size={"sm"}
                        onClick={() => console.log(breedErrors)}
                    >
                        Debug (Breed Errors)
                    </Button>
                    <Button
                        variant={"secondary"}
                        size={"sm"}
                        onClick={() => console.log(ctx)}
                    >
                        Debug (Context)
                    </Button>
                </div>
            ) : null}
            <PokemonIvColors />
        </div>
    )
}
