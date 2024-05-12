"use client"
import { PokemonBreed } from "@/core/breed"
import { PokemonBreedTreeSerializedSchema, useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import { PokemonGender } from "@/core/pokemon"
import { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { PokemonBreedTreePositionKey } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import { Try } from "@/lib/results"
import { ClipboardCopy, Import, RotateCcw, Save } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { useMediaQuery } from "usehooks-ts"
import { generateErrorMessage as generateZodErrorMessage } from "zod-error"
import { PokemonIvColors } from "./PokemonIvColors"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useToast } from "./ui/use-toast"

export type BreedErrors = Record<PokemonBreedTreePositionKey, Set<PokemonBreed.BreedError> | undefined>

export function PokemonBreedTree() {
    const loadedFromLocal = React.useRef(false)
    const ctx = useBreedTreeContext()

    React.useEffect(() => {
        if (loadedFromLocal.current) {
            return
        }

        ctx.loadFromLocalStorage()
        loadedFromLocal.current = true
    }, [ctx])

    if (!ctx.breedTarget.species || !ctx.breedTree.map["0,0"]) {
        return null
    }

    return <PokemonBreedTreeFinal />
}

function PokemonBreedTreeFinal() {
    const updateFromBreedEffect = React.useRef(false)
    const ctx = useBreedTreeContext()
    assert.exists(ctx.breedTarget.species, "PokemonSpecies must be defined in useBreedMap")

    const desired31IvCount = Object.values(ctx.breedTarget.ivs).filter(Boolean).length
    const [breedErrors, setBreedErrors] = React.useState<BreedErrors>({})

    function updateBreedTree(fromBreedEffect = false) {
        ctx.breedTree.setMap((prev) => ({ ...prev }))
        updateFromBreedEffect.current = fromBreedEffect
    }

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

    function handleRestartBreed() {
        ctx.resetLocalStorage()
        window.location.reload()
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
                if (error === PokemonBreed.BreedError.ChildDidNotChange) {
                    continue
                }
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
        if (updateFromBreedEffect.current) {
            return
        }

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
            updateBreedTree(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.breedTree.map, ctx.breedTarget.nature, desired31IvCount, ctx.breedTree.setMap, setBreedErrors])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2 mx-auto">
                {process.env.DEBUG_BUTTONS ? (
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
                <ResetBreedButton handleRestartBreed={handleRestartBreed} />
            </div>
            <PokemonIvColors />
            <ScrollArea className="max-w-screen-xl w-full 2xl:max-w-screen-2xl mx-auto">
                <div className="w-full flex flex-col-reverse items-center gap-8">
                    {Array.from({
                        length: ctx.breedTarget.nature ? desired31IvCount + 1 : desired31IvCount,
                    }).map((_, row) => {
                        const rowLength = Math.pow(2, row)

                        return (
                            <div
                                key={`row:${row}`}
                                className="flex w-full items-center justify-center"
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

function ImportExportButton(props: { handleExport: () => string }) {
    const { toast } = useToast()
    const ctx = useBreedTreeContext()
    const [jsonData, setJsonData] = React.useState("")

    function handleSave() {
        const unparsed = JSON.parse(jsonData)

        const res = PokemonBreedTreeSerializedSchema.safeParse(unparsed)
        if (res.error) {
            const errorMsg = generateZodErrorMessage(res.error.issues)

            toast({
                title: "Failed to save the breed tree JSON content.",
                description: errorMsg,
                variant: "destructive",
            })
            return
        }

        const deserialized = Try(() => ctx.deserialize(res.data))
        if (!deserialized.ok) {
            toast({
                title: "Failed to save the breed tree JSON content.",
                description: (deserialized.error as Error).message ?? "",
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
                        <Textarea
                            rows={16}
                            className="w-full resize-none border-none"
                            value={jsonData}
                            onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
                        />
                    </code>
                </pre>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="absolute top-6 right-8 md:right-10 h-8 w-8"
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

function ResetBreedButton(props: { handleRestartBreed: () => void }) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"destructive"} className="gap-1">
                        <RotateCcw size={16} />
                        Reset
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset current breed</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reset the current breed?
                            <br />
                            All progress will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant={"destructive"} onClick={props.handleRestartBreed}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant={"destructive"} className="gap-1">
                    <RotateCcw size={16} />
                    Reset
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Reset current breed</DrawerTitle>
                    <DrawerDescription>
                        Are you sure you want to reset the current breed?
                        All progress will be lost.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant={"destructive"} onClick={props.handleRestartBreed}>
                            Confirm
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
    )
}
