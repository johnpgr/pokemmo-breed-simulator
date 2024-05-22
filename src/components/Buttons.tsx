"use client"
import { PokemonBreedTreeSerializedSchema, useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import { Try } from "@/lib/results"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { ClipboardCopy, Import, RotateCcw, Save } from "lucide-react"
import React from "react"
import { useMediaQuery } from "usehooks-ts"
import { generateErrorMessage as generateZodErrorMessage } from "zod-error"
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
import { Textarea } from "./ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useToast } from "./ui/use-toast"

export function JsonImportButton(props: { handleImportJson: (data: string) => void }) {
    const [jsonData, setJsonData] = React.useState("")

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="gap-2" type="button" variant={"secondary"}>
                    <Import size={16} />
                    Import
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4 w-96">
                <pre spellCheck={false}>
                    <code>
                        <Textarea
                            className="w-full resize-none border-none"
                            rows={16}
                            value={jsonData}
                            onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
                        />
                    </code>
                </pre>
                <Button className="gap-1" onClick={() => props.handleImportJson(jsonData)}>
                    <Save size={16} />
                    Save
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export function ImportExportButton(props: { handleExport: () => string }) {
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

export function ResetBreedButton(props: { handleRestartBreed: () => void }) {
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
                        Are you sure you want to reset the current breed? All progress will be lost.
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
        </Drawer>
    )
}
