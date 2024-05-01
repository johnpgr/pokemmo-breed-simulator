"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { pascalToSpacedPascal, randomString } from "@/lib/utils"
import React from "react"
import { PokemonIv } from "@/core/pokemon"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"
import { IV_DROPDOWN_LIST_VALUES, POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS } from "./consts"
import { PokemonIvRadioGroup, PokemonIvRadioItem } from "./PokemonIvRadio"

export function PokemonIvsSelect(props: {
    natured: boolean
    desired31IVCount: number
    setDesired31IVCount: React.Dispatch<React.SetStateAction<number>>
    currentIVDropdownValues: PokemonIv[]
    setCurrentIVDropdownValues: React.Dispatch<React.SetStateAction<PokemonIv[]>>
    currentPokemonInSelect: PokemonNodeInSelect
    setCurrentPokemonInSelect: React.Dispatch<React.SetStateAction<PokemonNodeInSelect>>
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

    const pokemonCount = props.natured
        ? POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS[
              props.desired31IVCount as keyof typeof POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS
          ].natured
        : POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS[
              props.desired31IVCount as keyof typeof POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS
          ].natureless

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
            <p className="text-foreground/70 text-sm pb-1">How many IV's do you want?</p>
            <PokemonIvRadioGroup
                className="border rounded w-fit flex"
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
            <div className="flex pt-1 flex-col md:flex-row items-center gap-2">
                {Object.entries(pokemonCount).map(([_, value], i) => (
                    <div key={randomString(6)} className="w-full">
                        <Label key={randomString(6)} className="text-sm text-foreground/70">
                            <strong className="text-lg text-foreground mr-1">{value}</strong> 1x31 IV in
                        </Label>
                        <Select
                            value={props.currentIVDropdownValues[i]!}
                            onValueChange={(v) => handleIvSelectChange(v as PokemonIv, i)}
                        >
                            <SelectTrigger>
                                <SelectValue aria-label={props.currentIVDropdownValues[i]}>
                                    {pascalToSpacedPascal(props.currentIVDropdownValues[i]!)}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {IV_DROPDOWN_LIST_VALUES.map((iv) => (
                                    <SelectItem key={randomString(6)} value={iv}>
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
