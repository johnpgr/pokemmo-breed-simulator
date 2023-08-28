import type { getPokemonByName } from "@/actions/pokemon-by-name"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Pokemon } from "@/data/types"
import { getSprite, parseNames } from "@/lib/utils"
import clsx from "clsx"
import { ChevronsUpDown } from "lucide-react"
import { For, block } from "million/react"
import React from "react"

function Species(props: {
  pokemons: Array<{
    name: string
    number: number
  }>
  pokemon: Pokemon | null
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>
  getPokemonByName: typeof getPokemonByName
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  async function handleSelectPokemon(name: string) {
    const pokemon = await props.getPokemonByName(name)
    props.setPokemon(pokemon)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"ghost"}
            className={clsx("border", {
              "pl-2": props.pokemon,
              "pl-4": !props.pokemon,
            })}
          >
            {props.pokemon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="top-[1px] left-0"
                src={getSprite(props.pokemon.name)}
                style={{
                  imageRendering: "pixelated",
                }}
                alt={props.pokemon?.name}
              />
            ) : null}
            {props.pokemon
              ? parseNames(props.pokemon.name)
              : "Select a pokemon"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    <React.Fragment key={`pokemon_to_breed:${pokemon.name}`}>
                      <CommandItem
                        value={pokemon.name}
                        onSelect={handleSelectPokemon}
                        data-cy={`${pokemon.name}-value`}
                        className="cursor-pointer"
                      >
                        {parseNames(pokemon.name)}
                      </CommandItem>
                      <Separator />
                    </React.Fragment>
                  )}
                </For>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default block(Species)
