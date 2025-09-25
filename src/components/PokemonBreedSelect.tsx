"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { BreedContext } from "@/core/PokemonBreedContext"
import { ZBreedMap } from "@/core/PokemonBreedMap"
import type { PokemonIv, PokemonNature, PokemonSpecies } from "@/core/pokemon"
import { assert } from "@/lib/assert"
import { run } from "@/lib/utils"
import { Info, PlayIcon, RotateCcw } from "lucide-react"
import React from "react"
import { generateErrorMessage } from "zod-error"
import { JsonImportButton } from "./Buttons"
import { PokemonIvSelect } from "./PokemonIvSelect"
import { PokemonNatureSelect } from "./PokemonNatureSelect"
import { PokemonSpeciesSelect } from "./PokemonSpeciesSelect"
import {
  BREED_EXPECTED_COSTS,
  DEFAULT_IV_DROPDOWN_VALUES,
  POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS,
} from "./consts"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

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
  const ctx = React.use(BreedContext)!
  const [desired31IVCount, setDesired31IVCount] = React.useState(2)
  const [currentIVDropdownValues, setCurrentIVDropdownValues] = React.useState(
    DEFAULT_IV_DROPDOWN_VALUES,
  )
  const [currentPokemonInSelect, setCurrentPokemonInSelect] =
    React.useState<PokemonNodeInSelect>({
      ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount)),
    })
  const expectedCost = getExpectedBreedCost(
    desired31IVCount,
    Boolean(currentPokemonInSelect.nature),
  )
  const breederKindCountTable = run(() => {
    const table = POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS[desired31IVCount]
    assert(
      table,
      "POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS accessed with an invalid key.",
    )

    if (currentPokemonInSelect.nature) {
      return table.natured
    }

    return table.natureless
  })
  const totalBreedPokemonCount = Object.values(breederKindCountTable).reduce(
    (acc, val) => acc + val,
    0,
  )

  function validateIvFieldsUniqueness() {
    const selectedValues = currentIVDropdownValues.slice(0, desired31IVCount)
    const uniques = new Set(selectedValues)
    return uniques.size === selectedValues.length
  }

  function handleStartBreed(e: React.FormEvent<HTMLFormElement>) {
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

    assert(finalIvs.length >= 2, "At least 2 IV fields must be selected")
    ctx.breedTree.setMap((prev) => {
      const target = prev["0,0"]!
      target.species = currentPokemonInSelect.species
      target.ivs = finalIvs
      target.nature = currentPokemonInSelect.nature
      return { ...prev }
    })
    ctx.breedTree.initialize()
  }

  function handleResetFields() {
    setCurrentPokemonInSelect({
      ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount)),
    })
    setDesired31IVCount(2)
    setCurrentIVDropdownValues(DEFAULT_IV_DROPDOWN_VALUES)
  }

  function handleImportJson(json: string) {
    let dataUnparsed
    try {
      dataUnparsed = JSON.parse(json)
    } catch (error) {
      toast({
        title: "Failed to import the breed tree JSON content.",
        description: (error as Error).message,
        variant: "destructive",
      })
      return
    }

    const res = ZBreedMap.safeParse(dataUnparsed)

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

  if (ctx.breedTree.rootNode().species) {
    return null
  }

  return (
    <form
      className="mb-4 container max-w-screen-xl mx-auto flex flex-col items-center gap-4"
      onSubmit={handleStartBreed}
    >
      <h1 className="text-2xl font-medium">Select a Pokémon to breed</h1>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <div className="flex justify-between items-end">
            <PokemonSpeciesSelect
              currentSelectedNode={currentPokemonInSelect}
              setCurrentSelectedNode={setCurrentPokemonInSelect}
            />
            <JsonImportButton handleImportJson={handleImportJson} />
          </div>
          <PokemonNatureSelect
            currentPokemonInSelect={currentPokemonInSelect}
            setCurrentPokemonInSelect={setCurrentPokemonInSelect}
          />
          <PokemonIvSelect
            breederKindCountTable={breederKindCountTable}
            desired31IVCount={desired31IVCount}
            setDesired31IVCount={setDesired31IVCount}
            currentPokemonInSelect={currentPokemonInSelect}
            setCurrentPokemonInSelect={setCurrentPokemonInSelect}
            currentIVDropdownValues={currentIVDropdownValues}
            setCurrentIVDropdownValues={setCurrentIVDropdownValues}
          />
        </div>
      </div>
      <Alert className="w-fit space-y-4 mt-4">
        <AlertTitle className="flex items-center text-sm gap-2">
          <Info size={20} />
          For this Pokémon breed you will spend ≈ ${expectedCost} and you may
          need {totalBreedPokemonCount} Pokémon.
        </AlertTitle>
        <AlertDescription className="flex items-center justify-center gap-2">
          <Button className="gap-2" type="submit">
            <PlayIcon size={16} />
            Start Breeding
          </Button>
          <Button
            className="gap-2"
            type="reset"
            variant={"destructive"}
            onClick={handleResetFields}
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </AlertDescription>
      </Alert>
    </form>
  )
}

export function getExpectedBreedCost(
  desired31IVCount: number,
  natured: boolean,
) {
  const costsTable = BREED_EXPECTED_COSTS[desired31IVCount]
  assert(costsTable, "Expected cost must be defined")

  if (natured) {
    return costsTable.natured
  }

  return costsTable.natureless
}
