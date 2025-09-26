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
import { pascalToSpacedPascal } from "@/lib/utils"

const IV_DROPDOWN_LIST_VALUES: PokemonIv[] = [
  PokemonIv.HP,
  PokemonIv.Attack,
  PokemonIv.Defense,
  PokemonIv.SpecialDefense,
  PokemonIv.SpecialAttack,
  PokemonIv.Speed,
]

export interface PokemonIvSelectProps {
  ivCount: number
  breederKindCountTable: Record<string, number>
  setDesired31IVCount: React.Dispatch<React.SetStateAction<number>>
  currentIVDropdownValues: PokemonIv[]
  setCurrentIVDropdownValues: React.Dispatch<React.SetStateAction<PokemonIv[]>>
  setCurrentPokemonInSelect: React.Dispatch<
    React.SetStateAction<PokemonNodeInSelect>
  >
}

export const PokemonIvSelect: React.FC<PokemonIvSelectProps> = ({
  ivCount,
  breederKindCountTable,
  currentIVDropdownValues,
  setCurrentIVDropdownValues,
  setCurrentPokemonInSelect,
  setDesired31IVCount,
}) => {
  function handleDesired31IvCountChange(number: string) {
    const value = parseInt(number)
    const ivSet = new Set(currentIVDropdownValues.slice(0, value))
    setCurrentPokemonInSelect((prev) => ({
      ...prev,
      ivs: ivSet,
    }))
    setDesired31IVCount(ivSet.size)
  }

  function handleIvSelectChange(value: PokemonIv, index: number) {
    const newDropDownValues = [...currentIVDropdownValues]
    newDropDownValues[index] = value
    setCurrentIVDropdownValues(newDropDownValues)
    setCurrentPokemonInSelect((prev) => ({
      ...prev,
      ivs: new Set(newDropDownValues.slice(0, ivCount)),
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
        {Object.entries(breederKindCountTable).map(([, value], i) => (
          <div key={`PokemonIvSelect:${i}`} className="w-full">
            <Label className="text-foreground/70 text-sm">
              <strong className="text-foreground mr-1 text-lg">{value}</strong>{" "}
              1x31 IV in
            </Label>
            <Select
              value={currentIVDropdownValues[i]!}
              onValueChange={(v) => handleIvSelectChange(v as PokemonIv, i)}
            >
              <SelectTrigger className="w-full">
                <SelectValue aria-label={currentIVDropdownValues[i]}>
                  {pascalToSpacedPascal(currentIVDropdownValues[i]!)}
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
