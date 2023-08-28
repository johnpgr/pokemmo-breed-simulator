"use client"
import { Button } from "@/app/_components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/_components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover"
import { ScrollArea } from "@/app/_components/ui/scroll-area"
import { Separator } from "@/app/_components/ui/separator"
import { getPokemonByName, getSprite, parseNames } from "@/lib/utils"
import { For, block } from "million/react"
import { Fragment, useId, useState } from "react"
import type { BreedNode, GenderType, Position } from "./types"
import { usePokemonToBreed } from "../_context/hooks"

const PokemonSelect = block(
  (props: {
    pokemons: {
      name: string
      number: number
    }[]
    position: Position
    set: (key: Position, value: BreedNode | null) => void
  }) => {
    const id = useId()
    const { pokemon: pokemonToBreed } = usePokemonToBreed()
    const isPokemonToBreed = props.position === "0,0"

    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState<string | undefined>(
      undefined,
    )
    const [gender, setGender] = useState<GenderType | null>(null)

    async function handleSelectPokemon(name: string) {
      const pokemon = await getPokemonByName(name)
      setSelectedPokemon(pokemon.name)

      props.set(props.position, {
        gender,
        pokemon,
      })

      setIsOpen(false)
    }

    return (
      <Popover
        open={isPokemonToBreed ? false : isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            className="rounded-full bg-neutral-300 dark:bg-neutral-800"
          >
            {selectedPokemon || isPokemonToBreed ? (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                src={getSprite(
                  isPokemonToBreed ? pokemonToBreed!.name : selectedPokemon!,
                )}
                style={{
                  imageRendering: "pixelated",
                }}
                className="mb-1"
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search pokemon..."
              value={search}
              onValueChange={setSearch}
              data-cy="search-pokemon-input"
            />
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                <For
                  each={props.pokemons.filter((pokemon) =>
                    pokemon.name.toLowerCase().includes(search.toLowerCase()),
                  )}
                >
                  {(pokemon) => (
                    <Fragment key={`${id}:${pokemon.name}`}>
                      <CommandItem
                        value={pokemon.name}
                        onSelect={handleSelectPokemon}
                        data-cy={`${pokemon.name}-value`}
                      >
                        {parseNames(pokemon.name)}
                      </CommandItem>
                      <Separator />
                    </Fragment>
                  )}
                </For>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

export default PokemonSelect
