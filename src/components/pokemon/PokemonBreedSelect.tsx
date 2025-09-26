import { Button } from "@/components/ui/button"
import {
  PokemonIv,
  type PokemonNature,
  type PokemonSpecies,
} from "@/core/pokemon"
import { assert, getExpectedBreedCost } from "@/lib/utils"
import { Info, PlayIcon, RotateCcw } from "lucide-react"
import React from "react"
import { JsonImportButton } from "@/components/JsonImportButton"
import { PokemonIvSelect } from "./PokemonIvSelect"
import { PokemonNatureSelect } from "./PokemonNatureSelect"
import { PokemonSpeciesSelect } from "./PokemonSpeciesSelect"
import { POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS } from "@/lib/consts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { z } from "zod"
import { BreedContext } from "@/contexts/breed-context/store"
import { PokemonIvSet } from "@/core/ivset"
import { ZBreedMap } from "@/core/types"
import { PokemonBreedTarget } from "@/core/breed-target"

const DEFAULT_IV_DROPDOWN_VALUES: PokemonIv[] = [
  PokemonIv.HP,
  PokemonIv.Attack,
  PokemonIv.Defense,
  PokemonIv.SpecialDefense,
  PokemonIv.Speed,
]

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
  const ctx = React.use(BreedContext)
  const [ivCount, setIvCount] = React.useState(2)
  const [currentIVDropdownValues, setCurrentIVDropdownValues] = React.useState(
    DEFAULT_IV_DROPDOWN_VALUES,
  )

  const [currentPokemonInSelect, setCurrentPokemonInSelect] =
    React.useState<PokemonNodeInSelect>({
      ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, ivCount)),
    })

  const expectedCost = getExpectedBreedCost(
    ivCount,
    Boolean(currentPokemonInSelect.nature),
  )

  const breederKindCountTable = (() => {
    const table = POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS[ivCount]
    assert(
      table,
      "POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS accessed with an invalid key.",
    )

    if (currentPokemonInSelect.nature) {
      return table.natured
    }

    return table.natureless
  })()

  const totalBreedPokemonCount = Object.values(breederKindCountTable).reduce(
    (acc, val) => acc + val,
    0,
  )

  function validateIvFieldsUniqueness() {
    const selectedValues = currentIVDropdownValues.slice(0, ivCount)
    const uniques = new Set(selectedValues)
    return uniques.size === selectedValues.length
  }

  function handleStartBreed(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!currentPokemonInSelect.species) {
      toast.error("No Pokemon was selected", {
        description: "You must select a Pokemon to breed.",
      })
      return
    }

    if (!validateIvFieldsUniqueness()) {
      toast.error("Invalid IVs", {
        description: "You can't have the same stats in multiple IVs field.",
      })
      return
    }

    const finalIvs = Array.from(currentPokemonInSelect.ivs)

    assert(finalIvs.length >= 2, "At least 2 IV fields must be selected")

    const breedTarget = new PokemonBreedTarget(
      PokemonIvSet.fromArray(finalIvs),
      currentPokemonInSelect.species,
      currentPokemonInSelect.nature,
    )
    ctx.setBreedTarget(breedTarget)
    ctx.initializeBreedMap(breedTarget)
    ctx.updateBreedTree()
  }

  function handleResetFields() {
    setCurrentPokemonInSelect({
      ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, ivCount)),
    })
    setIvCount(2)
    setCurrentIVDropdownValues(DEFAULT_IV_DROPDOWN_VALUES)
  }

  function handleImportJson(json: string) {
    let dataUnparsed
    try {
      dataUnparsed = JSON.parse(json)
    } catch (error) {
      toast.error("Failed to import the breed tree JSON content.", {
        description: (error as Error).message,
      })
      return
    }

    const res = ZBreedMap.safeParse(dataUnparsed)

    if (res.error) {
      toast.error("Failed to import the breed tree JSON content.", {
        description: z.prettifyError(res.error),
      })
      return
    }

    ctx.deserialize(res.data)
  }

  if (ctx.breedTarget) {
    return null
  }

  return (
    <form
      className="container mx-auto mb-4 flex max-w-screen-xl flex-col items-center gap-4"
      onSubmit={handleStartBreed}
    >
      <h1 className="text-2xl font-medium">Select a Pokémon to breed</h1>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <p className="text-foreground/70 pb-1 text-sm">
            What Pokémon species?
          </p>
          <div className="flex items-end justify-between">
            <PokemonSpeciesSelect
              currentSelectedNode={currentPokemonInSelect}
              setCurrentSelectedNode={setCurrentPokemonInSelect}
            />
            <JsonImportButton handleImportJson={handleImportJson} />
          </div>
          <p className="text-foreground/70 pb-1 text-sm">
            Consider nature in breeding project?
          </p>
          <PokemonNatureSelect
            currentPokemonInSelect={currentPokemonInSelect}
            setCurrentPokemonInSelect={setCurrentPokemonInSelect}
          />
          <PokemonIvSelect
            breederKindCountTable={breederKindCountTable}
            ivCount={ivCount}
            setDesired31IVCount={setIvCount}
            setCurrentPokemonInSelect={setCurrentPokemonInSelect}
            currentIVDropdownValues={currentIVDropdownValues}
            setCurrentIVDropdownValues={setCurrentIVDropdownValues}
          />
        </div>
      </div>
      <Alert className="mt-4 w-fit space-y-4">
        <AlertTitle className="flex items-center gap-2 text-sm">
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
