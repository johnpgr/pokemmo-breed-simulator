"use client"
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
import { getSprite, parseNames, randomString } from "@/lib/utils"
import { For, block } from "million/react"
import { Fragment, useEffect, useId, useState } from "react"
import type { BreedNode, GenderType, Position } from "./types"
import { usePokemonToBreed } from "@/context/hooks"
import type { getPokemonByName } from "@/actions/pokemon-by-name"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Pokemon } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const PokemonSelect = block(
  (props: {
    pokemons: Array<{
      name: string
      number: number
    }>
    position: Position
    set: (key: Position, value: BreedNode | null) => void
    get: (key: Position) => BreedNode | null
    getPokemonByName: typeof getPokemonByName
  }) => {
    const id = useId()
    const { pokemon: pokemonToBreed } = usePokemonToBreed()
    const isPokemonToBreed = props.position === "0,0"

    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [gender, setGender] = useState<GenderType | null>(null)
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
    const [currentNode, setCurrentNode] = useState<BreedNode | null>(null)

    async function handleSelectPokemon(name: string) {
      const pokemon = await props.getPokemonByName(name)
      if (!pokemon) return

      setSelectedPokemon(pokemon)
      // props.set(props.position, {
      //   gender,
      //   pokemon,
      // })

      setIsOpen(false)
    }

    function handleOpenPopover(open: boolean) {
      const currentNode = props.get(props.position)
      setCurrentNode(currentNode)
      setIsOpen(!!open)
    }

    return (
      <Popover
        open={isPokemonToBreed ? false : isOpen}
        onOpenChange={handleOpenPopover}
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
                  isPokemonToBreed
                    ? pokemonToBreed!.name
                    : selectedPokemon!.name,
                )}
                style={{
                  imageRendering: "pixelated",
                }}
                className="mb-1"
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 relative">
          {currentNode ? (
            <CurrentNodeInformationCard currentNode={currentNode} />
          ) : null}
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

function CurrentNodeInformationCard(props: { currentNode: BreedNode }) {
  return (
    <Card className="absolute w-48 -ml-52">
      <CardHeader>
        <CardTitle className="text-lg">
          {props.currentNode.pokemon?.name ?? "Unselected"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span>IVs</span>
        <div className="flex gap-2">
          {props.currentNode.ivs?.map((iv) => (
            <span key={randomString(4)} className="capitalize">
              {iv}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
