"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { IVSet, PokemonBreedTreeSerializedSchema, useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import type { PokemonIv, PokemonNature, PokemonSpecies } from "@/core/pokemon"
import { assert } from "@/lib/assert"
import { Try } from "@/lib/results"
import { Import, Save } from "lucide-react"
import React from "react"
import { generateErrorMessage } from "zod-error"
import { PokemonIvSelect } from "./PokemonIvSelect"
import { PokemonNatureSelect } from "./PokemonNatureSelect"
import { PokemonSpeciesSelect } from "./PokemonSpeciesSelect"
import { DEFAULT_IV_DROPDOWN_VALUES } from "./consts"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"

/**
 * This type is used to represent the state of the full Pokemon node that is going to be used in the PokemonToBreedContext
 * It is a state object that will change as the user changes the select fields
 */
export type PokemonNodeInSelect = {
    species?: PokemonSpecies
    nature?: PokemonNature
    ivs: Set<PokemonIv>
}

export function PokemonToBreedSelect() {
    const { toast } = useToast()
    const ctx = useBreedTreeContext()
    const [desired31IVCount, setDesired31IVCount] = React.useState(2)
    const [currentIVDropdownValues, setCurrentIVDropdownValues] = React.useState(DEFAULT_IV_DROPDOWN_VALUES)
    const [currentPokemonInSelect, setCurrentPokemonInSelect] = React.useState<PokemonNodeInSelect>({
        ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount)),
    })

    function validateIvFieldsUniqueness() {
        const selectedValues = currentIVDropdownValues.slice(0, desired31IVCount)
        const uniques = new Set(selectedValues)
        return uniques.size === selectedValues.length
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!currentPokemonInSelect.species) {
            toast({
                title: "No Pokemon was selected",
                description: "You must select a Pokemon to breed.",
                variant: "destructive",
            })
            return
        }

        if (!validateIvFieldsUniqueness()) {
            toast({
                title: "Invalid IVs",
                description: "You can't have the same stats in multiple IVs field.",
                variant: "destructive",
            })
            return
        }

        const finalIvs = Array.from(currentPokemonInSelect.ivs)

        assert.exists(finalIvs[0], "At least 2 IV fields must be selected")
        assert.exists(finalIvs[1], "At least 2 IV fields must be selected")

        ctx.breedTarget.setIvs(new IVSet(finalIvs[0], finalIvs[1], finalIvs[2], finalIvs[3], finalIvs[4]))
        ctx.breedTarget.setNature(currentPokemonInSelect.nature)
        ctx.breedTarget.setSpecies(currentPokemonInSelect.species)
    }

    function handleImportJson(json: string) {
        const dataUnparsed = Try(() => JSON.parse(json))

        if (!dataUnparsed.ok) {
            toast({
                title: "Failed to import the breed tree JSON content.",
                description: (dataUnparsed.error as Error).message,
                variant: "destructive",
            })
            return
        }

        const res = PokemonBreedTreeSerializedSchema.safeParse(dataUnparsed)

        if (res.error) {
            const errorMsg = generateErrorMessage(res.error.issues)

            toast({
                title: "Failed to import the breed tree JSON content.",
                description: errorMsg,
                variant: "destructive",
            })
            return
        }

        ctx.deserialize(res.data)
    }

    if (ctx.breedTarget.species) {
        return null
    }

    return (
        <form
            className="mb-4 container max-w-screen-xl mx-auto flex flex-col items-center gap-4"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-medium">Select a Pokemon to breed</h1>
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full flex-col gap-2">
                    <PokemonSpeciesSelect
                        currentSelectedNode={currentPokemonInSelect}
                        setCurrentSelectedNode={setCurrentPokemonInSelect}
                    />
                    <PokemonNatureSelect
                        currentPokemonInSelect={currentPokemonInSelect}
                        setCurrentPokemonInSelect={setCurrentPokemonInSelect}
                    />
                    <PokemonIvSelect
                        natured={Boolean(currentPokemonInSelect.nature)}
                        desired31IVCount={desired31IVCount}
                        setDesired31IVCount={setDesired31IVCount}
                        currentPokemonInSelect={currentPokemonInSelect}
                        setCurrentPokemonInSelect={setCurrentPokemonInSelect}
                        currentIVDropdownValues={currentIVDropdownValues}
                        setCurrentIVDropdownValues={setCurrentIVDropdownValues}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button type="submit">Start Breeding</Button>
                <JsonImportButton handleImportJson={handleImportJson} />
            </div>
        </form>
    )
}

function JsonImportButton(props: { handleImportJson: (data: string) => void }) {
    const [jsonData, setJsonData] = React.useState("")

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="gap-1" type="button" variant={"secondary"}>
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
