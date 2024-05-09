"use client"
import React from "react"
import { PokemonBreed } from "@/core/breed"
import { useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import { PokemonGender } from "@/core/pokemon"
import { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { PokemonBreedTreePositionKey } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import { PokemonBreedTreeSerializedSchema } from "@/persistence/schema"
import { ClipboardCopy, Import, Save } from "lucide-react"
import { toast } from "sonner"
import { generateErrorMessage } from "zod-error"
import { PokemonIvColors } from "./PokemonIvColors"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useToast } from "./ui/use-toast"

export type BreedErrors = Record<PokemonBreedTreePositionKey, Set<PokemonBreed.BreedError> | undefined>

export function PokemonBreedTree() {
    const ctx = useBreedTreeContext()
    if (!ctx.breedTarget.species || Object.values(ctx.breedTree.map).length < 1) {
        return null
    }

    return <PokemonBreedTreeFinal />
}

function PokemonBreedTreeFinal() {
    const ctx = useBreedTreeContext()
    assert.exists(ctx.breedTarget.species, "PokemonSpecies must be defined in useBreedMap")

    const desired31IvCount = Object.values(ctx.breedTarget.ivs).filter(Boolean).length
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

    function handleExport(): string {
        const serialized = ctx.serialize()
        return JSON.stringify(serialized, null, 4)
    }

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
                errorMsg += error
                errorMsg += ", "
            }

            if (errorMsg.endsWith(", ")) {
                errorMsg = errorMsg.slice(0, -2)
            }

            toast.error(`${node.species.name} cannot breed with ${partner.species.name}.`, {
                description: `Error codes: ${errorMsg}`,
                action: {
                    label: "Dismiss",
                    onClick: () => { },
                },
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breedErrors])

    React.useEffect(() => {
        const lastRow = ctx.breedTarget.nature ? desired31IvCount : desired31IvCount - 1
        const rowLength = Math.pow(2, lastRow)
        let changed = false

        //inc by 2 because we only want to breed() on one parent
        for (let col = 0; col < rowLength; col += 2) {
            const pos = new PokemonBreedTreePosition(lastRow, col)
            let node = ctx.breedTree.map[pos.key()]
            let partnerNode = node?.getPartnerNode(ctx.breedTree.map)

            function next() {
                node = node?.getChildNode(ctx.breedTree.map)
                partnerNode = node?.getPartnerNode(ctx.breedTree.map)
            }

            while (node && partnerNode) {
                // bind the current node position because next()
                // will move the node pointer before the errors are set
                const currentNodePos = node.position.key()

                if (!node.gender || !partnerNode.gender || !node.species || !partnerNode.species) {
                    if (breedErrors[pos.key()]) {
                        deleteErrors(currentNodePos)
                    }
                    break
                }

                const childNode = node.getChildNode(ctx.breedTree.map)
                if (!childNode) {
                    break
                }

                const breedResult = PokemonBreed.breed(node, partnerNode, childNode)

                if (!breedResult.ok) {
                    if (
                        breedResult.error.size === 1 &&
                        breedResult.error.has(PokemonBreed.BreedError.ChildDidNotChange)
                    ) {
                        deleteErrors(currentNodePos)
                        next()
                        continue
                    }

                    addErrors(currentNodePos, breedResult.error)
                    next()
                    continue
                }

                if (childNode.isRootNode()) {
                    deleteErrors(currentNodePos)
                    next()
                    continue
                }

                changed = true
                childNode.setSpecies(breedResult)

                if (childNode.species?.percentageMale === 0) {
                    childNode.setGender(PokemonGender.Female)
                } else if (childNode.species?.percentageMale === 100) {
                    childNode.setGender(PokemonGender.Male)
                } else if (childNode.isGenderless()) {
                    childNode.setGender(PokemonGender.Genderless)
                }

                deleteErrors(currentNodePos)
                next()
            }
        }

        if (changed) {
            ctx.breedTree.setMap({ ...ctx.breedTree.map })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.breedTree.map, ctx.breedTarget.nature, desired31IvCount, ctx.breedTree.setMap, setBreedErrors])

    return (
        <div className="flex flex-col-reverse items-center gap-8 pb-16">
            {Array.from({
                length: ctx.breedTarget.nature ? desired31IvCount + 1 : desired31IvCount,
            }).map((_, row) => {
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
                                    rowLength={rowLength}
                                    breedTree={ctx.breedTree.map}
                                    breedErrors={breedErrors}
                                >
                                    <PokemonNodeSelect
                                        position={position}
                                        breedTree={ctx.breedTree.map}
                                        setBreedTree={ctx.breedTree.setMap}
                                    />
                                </PokemonNodeLines>
                            )
                        })}
                    </div>
                )
            })}
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
            <ImportExportButton handleExport={handleExport} />
            <PokemonIvColors />
        </div>
    )
}

function ImportExportButton(props: { handleExport: () => string }) {
    const { toast } = useToast()
    const ctx = useBreedTreeContext()
    const [jsonData, setJsonData] = React.useState("")

    function handleSave() {
        const unparsed = JSON.parse(jsonData)
        const res = PokemonBreedTreeSerializedSchema.safeParse(unparsed)
        if (res.error) {
            const errorMsg = generateErrorMessage(res.error.issues)

            toast({
                title: "Failed to save the breed tree JSON content.",
                description: errorMsg,
                variant: "destructive",
            })
            return
        }
        try {
            ctx.deserialize(res.data)
        } catch (error) {
            toast({
                title: "Failed to save the breed tree JSON content.",
                description: (error as Error).message ?? "",
                variant: "destructive",
            })
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    className="gap-1"
                    variant={"secondary"}
                    onClick={() => setJsonData(props.handleExport())}
                >
                    <Import size={16} />
                    Import/Export
                </Button>
            </PopoverTrigger>
            <PopoverContent className="relative flex flex-col gap-4 w-96">
                <pre spellCheck={false}>
                    <code>
                        <ScrollArea className="w-full h-64 rounded-md">
                            <Textarea
                                rows={80}
                                className="w-full resize-none border-none rounded-none"
                                value={jsonData}
                                onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
                            />
                        </ScrollArea>
                    </code>
                </pre>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="absolute top-6 right-8 h-8 w-8"
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(jsonData)
                                        .then(() => {
                                            toast({
                                                title: "Copy success.",
                                                description: "The current breed state was copied to your clipboard.",
                                            })
                                        })
                                        .catch(() => {
                                            toast({
                                                title: "Copy failed.",
                                                description: "Failed to copy breed contents.",
                                            })
                                        })
                                }}
                            >
                                <ClipboardCopy size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button onClick={handleSave} className="gap-1">
                    <Save size={16} />
                    Save
                </Button>
            </PopoverContent>
        </Popover>
    )
}
