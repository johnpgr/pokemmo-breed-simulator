"use client"

import { Button } from "@/app/_components/ui/button"
import { usePokemonToBreed } from "@/app/_context/hooks"
import { IV } from "@/app/_context/types"
import { NatureType, Pokemon } from "@/data/types"
import React from "react"
import { Ivs } from "./ivs"
import { NatureSelect } from "./nature"
import { Species } from "./species"
import { useToast } from "@/app/_components/ui/use-toast"

export const PokemonToBreedSelector = (props: {
  pokemons: {
    name: string
    number: number
  }[]
}) => {
  const ctx = usePokemonToBreed()
  const { toast } = useToast()
  const [currentSelectValues, setCurrentSelectValues] = React.useState<IV[]>([
    "hp",
    "attack",
    "defense",
    "specialDefense",
    "speed",
  ])
  const [numberOf31IVs, setNumberOf31IVs] = React.useState<2 | 3 | 4 | 5>(2)
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null)
  const [ivs, setIvs] = React.useState<IV[]>(["hp", "attack"])
  const [natured, setNatured] = React.useState(false)
  const [nature, setNature] = React.useState<NatureType | null>(null)

  //TODO: Use React hook form with zod
  //TODO: Provide the path to the incorrect fields
  function validateIvFields() {
    const selectedValues = currentSelectValues.slice(0, numberOf31IVs)
    const uniques = new Set(selectedValues)
    return uniques.size === selectedValues.length
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const validIvs = validateIvFields()

    if (!validIvs) {
      toast({
        title: "Invalid IVs",
        description: "You can't have the same stats in multiple IVs field.",
        variant: "destructive",
      })
      return
    }

    ctx.setPokemon(pokemon)
    ctx.setIvs({
      a: ivs[0],
      b: ivs[1],
      c: ivs[2] || null,
      d: ivs[3] || null,
      e: ivs[4] || null,
    })
    ctx.setNature(nature)
  }

  return (
    <form
      className="container max-w-6xl mx-auto flex flex-col items-center gap-4"
      onSubmit={handleSubmit}
    >
      Select a pokemon to breed
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <Species
            pokemons={props.pokemons}
            setPokemon={setPokemon}
            selected={pokemon?.name}
          />
          <NatureSelect
            checked={natured}
            onCheckedChange={setNatured}
            nature={nature}
            setNature={setNature}
          />
          <Ivs
            natured={natured}
            setIvs={setIvs}
            currentSelectValues={currentSelectValues}
            setCurrentSelectValues={setCurrentSelectValues}
            numberOf31IVs={numberOf31IVs}
            setNumberOf31IVs={setNumberOf31IVs}
          />
        </div>
      </div>
      <pre>{JSON.stringify({ ivs, nature, pokemon }, null, 2)}</pre>
      <div className="flex items-center gap-2">
        <Button type="submit">Start Breeding</Button>
        <Button type="reset" variant={"destructive"}>
          Clear
        </Button>
      </div>
    </form>
  )
}
