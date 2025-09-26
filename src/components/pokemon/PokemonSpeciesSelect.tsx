import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { VirtualizedCommand } from "@/components/ui/virtualized-combobox"
import { PokemonSpecies, type PokemonSpeciesRaw } from "@/core/pokemon"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"
import { Data } from "@/lib/data"

export function PokemonSpeciesSelect(props: {
  currentSelectedNode: PokemonNodeInSelect
  setCurrentSelectedNode: React.Dispatch<
    React.SetStateAction<PokemonNodeInSelect>
  >
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const currentSelectedSpecies = props.currentSelectedNode.species

  function handleSpeciesSelect(pokemon: PokemonSpeciesRaw) {
    props.setCurrentSelectedNode((prev) => ({
      ...prev,
      species: PokemonSpecies.parse(pokemon),
    }))
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={`w-[240px] justify-between ${currentSelectedSpecies ? "pl-2" : "pl-4"}`}
        >
          <span className="flex items-center">
            {currentSelectedSpecies ? (
              <div
                className="-mt-1 -ml-2"
                style={{
                  width: currentSelectedSpecies.spriteMeta.width,
                  height: currentSelectedSpecies.spriteMeta.height,
                  backgroundImage: `url(${Data.spritesheet})`,
                  backgroundPosition: `-${currentSelectedSpecies.spriteMeta.x}px -${currentSelectedSpecies.spriteMeta.y}px`,
                  imageRendering: "pixelated",
                  backgroundRepeat: "no-repeat",
                }}
                aria-hidden
              />
            ) : null}
            {currentSelectedSpecies
              ? currentSelectedSpecies.name
              : "Select a Pokemon"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <VirtualizedCommand
          height="288px"
          options={Data.species.map((s) => ({
            value: s.name,
            label: s.name,
          }))}
          placeholder="Search pokemon..."
          selectedOption={currentSelectedSpecies?.name ?? ""}
          onSelectOption={(value) => {
            const pokemon = Data.species.find((p) => p.name === value)
            if (pokemon) handleSpeciesSelect(pokemon)
          }}
          renderOption={(option) => {
            const pokemon = Data.species.find(
              (p) => p.name === option.value,
            )!
            const meta = Data.monsterMapping[pokemon.id]
            const isSelected = currentSelectedSpecies?.name === pokemon.name

            return (
              <div className="flex items-center">
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
                <div
                  className="-mt-1 -ml-2"
                  style={{
                    width: meta.width,
                    height: meta.height,
                    backgroundImage: `url(${Data.spritesheet})`,
                    backgroundPosition: `-${meta.x}px -${meta.y}px`,
                    imageRendering: "pixelated",
                    backgroundRepeat: "no-repeat",
                  }}
                  aria-hidden
                />
                {option.label}
              </div>
            )
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
