import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PokemonIv } from "@/core/pokemon"
import React from "react"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"
import { PokemonIvRadioGroup, PokemonIvRadioItem } from "./PokemonIvRadio"
import { IV_DROPDOWN_LIST_VALUES } from "@/lib/consts"
import { pascalToSpacedPascal } from "@/lib/utils"

export function PokemonIvSelect(props: {
  desired31IVCount: number
  breederKindCountTable: Record<string, number>
  setDesired31IVCount: React.Dispatch<React.SetStateAction<number>>
  currentIVDropdownValues: PokemonIv[]
  setCurrentIVDropdownValues: React.Dispatch<React.SetStateAction<PokemonIv[]>>
  currentPokemonInSelect: PokemonNodeInSelect
  setCurrentPokemonInSelect: React.Dispatch<
    React.SetStateAction<PokemonNodeInSelect>
  >
}) {
  function handleDesired31IvCountChange(number: string) {
    const value = parseInt(number)
    const ivSet = new Set(props.currentIVDropdownValues.slice(0, value))
    props.setCurrentPokemonInSelect((prev) => ({
      ...prev,
      ivs: ivSet,
    }))
    props.setDesired31IVCount(ivSet.size)
  }

  function handleIvSelectChange(value: PokemonIv, index: number) {
    const newDropDownValues = [...props.currentIVDropdownValues]
    newDropDownValues[index] = value
    props.setCurrentIVDropdownValues(newDropDownValues)
    props.setCurrentPokemonInSelect((prev) => ({
      ...prev,
      ivs: new Set(newDropDownValues.slice(0, props.desired31IVCount)),
    }))
  }

  return (
    <div>
      <p className="text-foreground/70 pb-1 text-sm">
        How many IV&apos;s do you want?
      </p>
      <PokemonIvRadioGroup
        className="flex w-fit rounded-md border"
        defaultValue={"2"}
        onValueChange={handleDesired31IvCountChange}
      >
        <PokemonIvRadioItem className="border-0" value={"2"}>
          2
        </PokemonIvRadioItem>
        <PokemonIvRadioItem className="border-0" value={"3"}>
          3
        </PokemonIvRadioItem>
        <PokemonIvRadioItem className="border-0" value={"4"}>
          4
        </PokemonIvRadioItem>
        <PokemonIvRadioItem className="border-0" value={"5"}>
          5
        </PokemonIvRadioItem>
      </PokemonIvRadioGroup>
      <div className="flex flex-col items-center gap-2 pt-1 md:flex-row">
        {Object.entries(props.breederKindCountTable).map(([_, value], i) => (
          <div
            key={`PokemonIvSelect:${i}`}
            className="w-full"
          >
            <Label className="text-foreground/70 text-sm">
              <strong className="text-foreground mr-1 text-lg">{value}</strong>{" "}
              1x31 IV in
            </Label>
            <Select
              value={props.currentIVDropdownValues[i]!}
              onValueChange={(v) => handleIvSelectChange(v as PokemonIv, i)}
            >
              <SelectTrigger className="w-full">
                <SelectValue aria-label={props.currentIVDropdownValues[i]}>
                  {pascalToSpacedPascal(props.currentIVDropdownValues[i]!)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {IV_DROPDOWN_LIST_VALUES.map((iv) => (
                  <SelectItem key={`PokemonIvSelect:${i}:${iv}`} value={iv}>
                    {pascalToSpacedPascal(iv)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
}
