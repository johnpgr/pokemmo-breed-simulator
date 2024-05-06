"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type {
    PokemonIv,
    PokemonNature,
    PokemonSpecies,
    PokemonSpeciesUnparsed,
} from "@/core/pokemon"
import { assert } from "@/lib/assert"
import React from "react"
import { ExportedJsonObjSchema } from "./PokemonBreedTree"
import { IVSet, useBreedTreeContext } from "./PokemonBreedTreeContext"
import { PokemonIvSelect } from "./PokemonIvSelect"
import { PokemonNatureSelect } from "./PokemonNatureSelect"
import { PokemonSpeciesSelect } from "./PokemonSpeciesSelect"
import { DEFAULT_IV_DROPDOWN_VALUES } from "./consts"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"

/**
 * This type is used to represent the state of the full pokemon node that is going to be used in the PokemonToBreedContext
 * It is a state object that will change as the user changes the select fields
 */
export type PokemonNodeInSelect = {
    species?: PokemonSpecies
    nature?: PokemonNature
    ivs: Set<PokemonIv>
}

export function PokemonToBreedSelect(props: {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
}) {
    const { toast } = useToast()
    const ctx = useBreedTreeContext()
    const [desired31IVCount, setDesired31IVCount] = React.useState(2)
    const [currentIVDropdownValues, setCurrentIVDropdownValues] =
        React.useState(DEFAULT_IV_DROPDOWN_VALUES)
    const [currentPokemonInSelect, setCurrentPokemonInSelect] =
        React.useState<PokemonNodeInSelect>({
            ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount)),
        })

    //TODO: Maybe Provide the path to the incorrect fields
    function validateIvFields() {
        const selectedValues = currentIVDropdownValues.slice(
            0,
            desired31IVCount,
        )
        const uniques = new Set(selectedValues)
        return uniques.size === selectedValues.length
    }

    function handleResetFields() {
        setDesired31IVCount(2)
        setCurrentIVDropdownValues(DEFAULT_IV_DROPDOWN_VALUES)
        setCurrentPokemonInSelect({
            ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, 2)),
        })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!currentPokemonInSelect.species) {
            toast({
                title: "No pokemon was selected",
                description: "You must select a pokemon to breed.",
                variant: "destructive",
            })
            return
        }

        if (!validateIvFields()) {
            toast({
                title: "Invalid IVs",
                description:
                    "You can't have the same stats in multiple IVs field.",
                variant: "destructive",
            })
            return
        }

        const finalIvs = Array.from(currentPokemonInSelect.ivs)

        assert.exists(finalIvs[0], "At least 2 IV fields must be selected")
        assert.exists(finalIvs[1], "At least 2 IV fields must be selected")

        ctx.setIvs(
            new IVSet(
                finalIvs[0],
                finalIvs[1],
                finalIvs[2],
                finalIvs[3],
                finalIvs[4],
            ),
        )
        ctx.setNature(currentPokemonInSelect.nature)
        ctx.setSpecies(currentPokemonInSelect.species)
    }

    function handleImportJson(json: string) {
        const unparsed = JSON.parse(json)
        const res = ExportedJsonObjSchema.safeParse(unparsed)
        if (res.error) {
            toast({
                title: "Failed to import the breed tree JSON content.",
                description: (
                    <p>
                        {res.error.format()._errors.map((error, i) => (
                            <p key={`error:${i}`}>{error}</p>
                        ))}
                    </p>
                ),
                variant: "destructive",
            })
            return
        }

        ctx.importTargetPokemon(res.data)
    }

    if (ctx.species) {
        return null
    }

    return (
        <form
            className="mb-4 container max-w-screen-xl mx-auto flex flex-col items-center gap-4"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-medium">Select a pokemon to breed</h1>
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full flex-col gap-2">
                    <PokemonSpeciesSelect
                        pokemons={props.pokemonSpeciesUnparsed}
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
                <Button
                    type="reset"
                    variant={"destructive"}
                    onClick={handleResetFields}
                >
                    Reset
                </Button>
                <JsonImportButton handleImportJson={handleImportJson} />
            </div>
        </form>
    )
}

function JsonImportButton(props: { handleImportJson: (data: string) => void }) {
    const [jsonData, setJsonData] = React.useState("")

    return <Popover>
        <PopoverTrigger asChild>
            <Button type="button" variant={"secondary"}>Import from JSON</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4 w-96">
            <Textarea className="w-full" rows={10} value={jsonData} onChange={(e) => setJsonData(e.currentTarget?.value ?? "")} />
            <Button onClick={() => props.handleImportJson(jsonData)}>Submit</Button>
        </PopoverContent>
    </Popover>
}
