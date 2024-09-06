"use client"
import { PokemonBreed } from "@/core/breed"
import { PokemonGender } from "@/core/pokemon"
import { assert } from "@/lib/assert"
import { run } from "@/lib/utils"
import { Info } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { ImportExportButton, ResetBreedButton } from "./Buttons"
import { getExpectedBreedCost } from "./PokemonBreedSelect"
import { PokemonIvColors } from "./PokemonIvColors"
import { HeldItem, getHeldItemForNode } from "./PokemonNodeHeldItem"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { BREED_ITEM_COSTS, GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "./consts"
import { Alert, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { PokemonBreedMapPosition, PokemonBreedMapPositionKey } from "@/core/PokemonBreedMap"
import { BreedContext } from "@/core/PokemonBreedContext"

export type BreedErrors = Record<PokemonBreedMapPositionKey, Set<PokemonBreed.BreedError> | undefined>

export function PokemonBreedTreeView() {
    const loaded = React.useRef<boolean>()
    const updateFromBreedEffect = React.useRef(false)
    const ctx = React.use(BreedContext)!
    const target = ctx.breedTree.rootNode()
    const desired31IvCount = target.ivs!.filter(Boolean).length
    const [breedErrors, setBreedErrors] = React.useState<BreedErrors>({})
    const expectedCost = getExpectedBreedCost(desired31IvCount, Boolean(target.nature))
    const currentBreedCost = run(() => {
        let cost = 0
        const nodes = Object.values(ctx.breedTree.map)

        for (const node of nodes) {
            if (!node.species) {
                continue
            }

            const isLastRow = target.nature
                ? node.position.row === desired31IvCount
                : node.position.row === desired31IvCount - 1

            if (node.gender && !node.genderCostIgnored && !isLastRow) {
                if (node.gender === PokemonGender.Male) {
                    const newCost = GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[node.species.percentageMale]
                    assert(
                        newCost !== undefined,
                        "tried to get cost in GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE with invalid key",
                    )
                    cost += newCost
                } else if (node.gender === PokemonGender.Female) {
                    const newCost = GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[100 - node.species.percentageMale]
                    assert(
                        newCost !== undefined,
                        "tried to get cost in GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE with invalid key",
                    )
                    cost += newCost
                }
            }

            const heldItem = getHeldItemForNode(node, ctx.breedTree.map)
            if (!heldItem) {
                continue
            }

            if (heldItem === HeldItem.Nature) {
                cost += BREED_ITEM_COSTS.nature
                continue
            }

            cost += BREED_ITEM_COSTS.iv
        }

        return cost
    })

    function updateBreedTree(fromBreedEffect = false) {
        ctx.breedTree.setMap((prev) => ({ ...prev }))
        updateFromBreedEffect.current = fromBreedEffect
    }

    function deleteErrors(pos: PokemonBreedMapPositionKey) {
        setBreedErrors((prev) => {
            delete prev[pos]
            return { ...prev }
        })
    }

    function addErrors(pos: PokemonBreedMapPositionKey, errors: Set<PokemonBreed.BreedError>) {
        setBreedErrors((prev) => {
            prev[pos] = errors
            return { ...prev }
        })
    }

    function handleRestartBreed() {
        ctx.reset()
        window.location.reload()
    }

    React.useEffect(() => {
        if (!loaded.current) {
            ctx.load()
            loaded.current = true
        }
    }, [ctx.savedTree])

    React.useEffect(() => {
        if (target.species) ctx.save()
    }, [ctx.breedTree.map])

    // Show toast notifications for breed errors
    React.useEffect(() => {
        Object.entries(breedErrors).map(([key, errorKind]) => {
            if (!errorKind) {
                return
            }

            const node = ctx.breedTree.map[key]
            if (!node?.species) {
                return
            }

            const partner = node.getPartnerNode(ctx.breedTree.map)
            if (!partner?.species) {
                return
            }

            let errorMsg = ""
            for (const error of errorKind.values()) {
                if (error.kind === PokemonBreed.BreedErrorKind.ChildDidNotChange) {
                    continue
                }
                errorMsg += error.kind
                errorMsg += ", "
            }

            if (errorMsg.endsWith(", ")) {
                errorMsg = errorMsg.slice(0, -2)
            }

            toast.error(`${node.species.name} cannot breed with ${partner.species.name}.`, {
                description: `Error codes: ${errorMsg}`,
                action: {
                    label: "Dismiss",
                    onClick: () => {},
                },
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breedErrors])

    // Iterate through the breed tree and breed() the nodes
    React.useEffect(() => {
        if (updateFromBreedEffect.current) {
            return
        }

        const lastRow = target.nature ? desired31IvCount : desired31IvCount - 1
        const rowLength = Math.pow(2, lastRow)
        let changed = false

        //inc by 2 because we only want to breed() on one parent
        for (let col = 0; col < rowLength; col += 2) {
            const pos = new PokemonBreedMapPosition(lastRow, col)
            let node = ctx.breedTree.map[pos.key()]
            let partnerNode = node?.getPartnerNode(ctx.breedTree.map)

            const next = () => {
                node = node?.getChildNode(ctx.breedTree.map)
                partnerNode = node?.getPartnerNode(ctx.breedTree.map)
            }

            while (node && partnerNode) {
                // bind the current node position because next() will move the node pointer before the errors are set
                const currentNodePos = node.position.key()

                if (!node.gender || !partnerNode.gender || !node.species || !partnerNode.species) {
                    deleteErrors(currentNodePos)
                    next()
                    continue
                }

                const childNode = node.getChildNode(ctx.breedTree.map)
                if (!childNode) {
                    break
                }

                const breedResult = PokemonBreed.breed(node, partnerNode, childNode, ctx.evolutions)

                if (breedResult instanceof PokemonBreed.BreedErrors) {
                    const errors = Array.from(breedResult)
                    if (errors.length === 1 && errors[0]!.kind === PokemonBreed.BreedErrorKind.ChildDidNotChange) {
                        deleteErrors(currentNodePos)
                        next()
                        continue
                    }

                    addErrors(currentNodePos, breedResult)
                    next()
                    continue
                }

                if (childNode.isRootNode()) {
                    deleteErrors(currentNodePos)
                    next()
                    continue
                }

                changed = true
                childNode.species = breedResult
                childNode.gender = childNode.rollGender()

                deleteErrors(currentNodePos)
                next()
            }
        }

        if (changed) {
            updateBreedTree(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.breedTree.map, target.nature, desired31IvCount, ctx.breedTree.setMap, setBreedErrors])

    if (!target.species) return null

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2 mx-auto">
                {process.env.NODE_ENV === "development" ? (
                    <div className="space-x-4">
                        <Button variant={"secondary"} size={"sm"} onClick={() => console.log(ctx.breedTree.map)}>
                            Debug (Breed Tree)
                        </Button>
                        <Button variant={"secondary"} size={"sm"} onClick={() => console.log(breedErrors)}>
                            Debug (Breed Errors)
                        </Button>
                        <Button variant={"secondary"} size={"sm"} onClick={() => console.log(ctx)}>
                            Debug (Context)
                        </Button>
                    </div>
                ) : null}
                <ImportExportButton serialize={() => JSON.stringify(ctx.serialize(), null, 4)} />
                <ResetBreedButton handleRestartBreed={handleRestartBreed} />
            </div>
            <Alert className="mx-auto w-fit">
                <AlertTitle className="flex items-center gap-2">
                    <Info size={20} />
                    Current breed cost: ${currentBreedCost} / Expected cost: ${expectedCost}
                </AlertTitle>
            </Alert>
            <PokemonIvColors />
            <ScrollArea className="max-w-screen-xl w-full 2xl:max-w-screen-2xl mx-auto">
                <div className="w-full flex flex-col-reverse items-center gap-8">
                    {Array.from({
                        length: target.nature ? desired31IvCount + 1 : desired31IvCount,
                    }).map((_, row) => {
                        const rowLength = Math.pow(2, row)

                        return (
                            <div key={`row:${row}`} className="flex w-full items-center justify-center">
                                {Array.from({ length: rowLength }).map((_, col) => {
                                    const position = new PokemonBreedMapPosition(row, col)

                                    return (
                                        <PokemonNodeLines
                                            key={`node:${position.key()}`}
                                            position={position}
                                            rowLength={rowLength}
                                            breedTree={ctx.breedTree.map}
                                            breedErrors={breedErrors}
                                        >
                                            <PokemonNodeSelect
                                                desired31IvCount={desired31IvCount}
                                                position={position}
                                                breedTree={ctx.breedTree.map}
                                                updateBreedTree={updateBreedTree}
                                            />
                                        </PokemonNodeLines>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
