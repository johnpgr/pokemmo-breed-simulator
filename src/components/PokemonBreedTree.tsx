"use client"
import { PokemonBreed } from "@/core/breed"
import { PokemonGender, PokemonSpeciesUnparsed } from "@/core/pokemon"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { PokemonBreedTreeMapSerialized, PokemonBreedTreePositionKey, useBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import { ClipboardCopy, Import, Save } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { generateErrorMessage } from "zod-error"
import { useBreedTreeContext } from "./PokemonBreedTreeContext"
import { PokemonIvColors } from "./PokemonIvColors"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useToast } from "./ui/use-toast"
import { PokemonBreedTreeSerializedSchema } from "@/persistence/schema"
import { z } from "zod"

export type BreedErrors = Record<PokemonBreedTreePositionKey, Set<PokemonBreed.BreedError> | undefined>

export function PokemonBreedTree(props: { pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[] }) {
    const ctx = useBreedTreeContext()
    if (!ctx.species) {
        return null
    }

    return <PokemonBreedTreeFinal pokemonSpeciesUnparsed={props.pokemonSpeciesUnparsed} />
}

function PokemonBreedTreeFinal(props: { pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[] }) {
    const ctx = useBreedTreeContext()
    assert.exists(ctx.species, "PokemonSpecies must be defined in useBreedMap")

    const desired31IvCount = Object.values(ctx.ivs).filter(Boolean).length

    const [breedErrors, setBreedErrors] = React.useState<BreedErrors>({})
    const { breedTreeMap, setBreedTreeMap, serialize, deserialize, setHasImported } = useBreedTreeMap({
        finalPokemonNode: PokemonBreedTreeNode.ROOT({
            ivs: ctx.ivs,
            nature: ctx.nature,
            species: ctx.species,
        }),
        finalPokemonIvSet: ctx.ivs,
        desired31IvCount,
        pokemonSpeciesUnparsed: props.pokemonSpeciesUnparsed,
    })
    deserialize(ctx.serializedTree)

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
        const breedTarget = ctx.serializeTargetPokemon()
        const breedTree = serialize()
        const json = { breedTarget, breedTree } satisfies z.infer<typeof PokemonBreedTreeSerializedSchema>
        return JSON.stringify(json, null, 4)
    }

    React.useEffect(() => {
        Object.entries(breedErrors).map(([key, errorKind]) => {
            if (!errorKind) {
                return
            }

            const node = breedTreeMap[key]
            if (!node?.species) {
                return
            }

            const partner = node.getPartnerNode(breedTreeMap)
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
                // bind the current node position because next()
                // will move the node pointer before the errors are set
                const currentNodePos = node.position.key()

                if (!node.gender || !partnerNode.gender || !node.species || !partnerNode.species) {
                    if (breedErrors[pos.key()]) {
                        deleteErrors(currentNodePos)
                    }
                    break
                }

                const childNode = node.getChildNode(breedTreeMap)
                if (!childNode) {
                    break
                }

                const breedResult = PokemonBreed.breed(node, partnerNode, childNode)

                if (!breedResult.ok) {
                    if (breedResult.error.size === 1 && breedResult.error.has(PokemonBreed.BreedError.ChildDidNotChange)) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            const position = new PokemonBreedTreePosition(row, col)

                            return (
                                <PokemonNodeLines
                                    key={`node:${position.key()}`}
                                    position={position}
                                    rowLength={rowLength}
                                    breedTree={breedTreeMap}
                                    breedErrors={breedErrors}
                                >
                                    <PokemonNodeSelect
                                        pokemons={props.pokemonSpeciesUnparsed}
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
                    <Button variant={"secondary"} size={"sm"} onClick={() => console.log(breedTreeMap)}>
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
            <ImportExportButton
                handleExportJson={handleExport}
                setHasImported={setHasImported}
                deserialize={deserialize}
            />
            <PokemonIvColors />
        </div>
    )
}

function ImportExportButton(props: {
    handleExportJson: () => string
    setHasImported: React.Dispatch<React.SetStateAction<boolean>>
    deserialize: (serializedTreeMap?: PokemonBreedTreeMapSerialized) => void
}) {
    const [jsonData, setJsonData] = React.useState("")
    const ctx = useBreedTreeContext()
    const { toast } = useToast()

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
            ctx.deserializeTargetPokemon(res.data)
            props.setHasImported(false)
            props.deserialize(ctx.serializedTree)
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
                    onClick={() => setJsonData(props.handleExportJson())}
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
