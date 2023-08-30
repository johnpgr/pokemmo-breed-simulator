"use client"
import { Button } from "@/components/ui/button"

import type { getPokemonByName as getPokemonByNameFunc } from "@/actions/pokemon-by-name"
import { Female, Male } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { usePokemonToBreed } from "@/context/hooks"
import { Pokemon, PokemonSelectList } from "@/data/types"
import {
  camelToSpacedPascal,
  getSprite,
  parseNames,
  raise,
  randomString,
} from "@/lib/utils"
import { HelpCircle, Loader } from "lucide-react"
import { For, block } from "million/react"
import React from "react"
import { Gender } from "../consts"
import type { BreedNode, BreedNodeSetter, GenderType, Position } from "../types"
import { GenderlessPokemonEvolutionTree } from "../utils"
import { IV, IVMap } from "@/context/types"
import type { useBreedMap } from "../use-breed-map"
import { Color, IvColorMap } from "./iv-colors"

function filterPokemonByEggGroups(
  list: PokemonSelectList,
  currentPokemon: Pokemon,
): PokemonSelectList {
  const newList: PokemonSelectList = []

  const ditto =
    list.find((poke) => poke.name === "Ditto") ??
    raise("Ditto should be defined")

  newList.push(ditto)

  if (currentPokemon.eggTypes.includes("Genderless")) {
    const breedable = GenderlessPokemonEvolutionTree[
      currentPokemon.name as keyof typeof GenderlessPokemonEvolutionTree
    ] as Array<string>

    return newList.concat(list.filter((poke) => breedable.includes(poke.name)))
  }

  list.forEach((pokemon) => {
    const compatible = pokemon.eggTypes.some((e) =>
      currentPokemon.eggTypes.includes(e),
    )
    if (!compatible) return

    newList.push(pokemon)
  })
  return newList
}

function getColorsForCurrentNode(ivs: Array<IV>): Array<Color> {
  return ivs.map((iv) => IvColorMap[iv])
}

export const PokemonSelect = block(
  ({
    breedMap,
    getPokemonByName,
    pokemons,
    position,
  }: {
    pokemons: PokemonSelectList
    position: Position
    breedMap: ReturnType<typeof useBreedMap>
    getPokemonByName: typeof getPokemonByNameFunc
  }) => {
    const id = React.useId()
    const { pokemon: pokemonToBreed, ivMap } = usePokemonToBreed()
    const isPokemonToBreed = position === "0,0"

    const [searchMode, setSearchMode] = React.useState<"ALL" | "EGG_GROUP">(
      "ALL",
    )
    const [search, setSearch] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [gender, setGender] = React.useState<GenderType>(Gender.MALE)
    const [selectedPokemon, setSelectedPokemon] =
      React.useState<Pokemon | null>(null)
    const [currentNode, setCurrentNode] = React.useState<BreedNode | undefined>(
      undefined,
    )
    const [colors, setColors] = React.useState<Array<Color>>([])
    const [pending, startTransition] = React.useTransition()

    /* 
      This function is used to update the breedMap
      Since all nodes are already set, we can't just re-set them, we need to first get the node at current position and merge the new values
     */
    function setBreedNode(key: Position, value: BreedNodeSetter) {
      const node = breedMap.get(key)
      if (!node) return

      breedMap.set(key, {
        ...node,
        ...value,
      })
    }

    async function handleSelectPokemon(name: string) {
      const pokemon = await getPokemonByName(name)
      if (!pokemon) return

      setSelectedPokemon(pokemon)
      setBreedNode(position, {
        gender,
        pokemon,
      })

      setIsOpen(false)
    }

    function handleChangeGender(gender: GenderType) {
      setGender(gender)

      if (!selectedPokemon) return

      setBreedNode(position, {
        gender,
        pokemon: selectedPokemon,
      })
    }

    function handleSearchModeChange() {
      startTransition(() => {
        setSearchMode((prev) => (prev === "ALL" ? "EGG_GROUP" : "ALL"))
      })
    }

    function handleSearchInputChange(search: string) {
      setSearch(search)
    }

    const pokemonList = React.useMemo(
      () =>
        searchMode === "ALL"
          ? pokemons
          : filterPokemonByEggGroups(pokemons, pokemonToBreed!),
      [searchMode],
    )

    React.useEffect(() => {
      if (!currentNode) {
        const currentNode = breedMap.get(position)
        setCurrentNode(currentNode)
      }
    }, [])

    React.useEffect(() => {
      if (!currentNode) return
      if (!currentNode.ivs) return
      setColors(getColorsForCurrentNode(currentNode.ivs))
    }, [currentNode])

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            className="relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
          >
            {colors.map((color) => (
              <div
                key={randomString(3)}
                style={{
                  height: "100%",
                  backgroundColor: color,
                  width: 100 / colors.length,
                }}
              />
            ))}
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
                className="mb-1 absolute inset-0"
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 flex gap-4 max-w-lg w-full border-none bg-none shadow-none">
          {currentNode ? (
            <CurrentNodeInformationCard
              currentNode={currentNode}
              gender={gender}
              setGender={handleChangeGender}
            />
          ) : null}
          {!isPokemonToBreed ? (
            <Command className="w-72 border">
              <CommandInput
                placeholder="Search pokemon..."
                value={search}
                onValueChange={handleSearchInputChange}
                data-cy="search-pokemon-input"
              />
              <div className="flex items-center gap-2 text-xs text-foreground/80 p-1">
                <Switch
                  checked={searchMode === "EGG_GROUP"}
                  onCheckedChange={handleSearchModeChange}
                />
                Show only {pokemonToBreed?.name}&apos;s egg groups
              </div>
              <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72">
                  {pending ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <For
                      each={pokemonList.filter((pokemon) =>
                        pokemon.name
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )}
                    >
                      {(pokemon) => (
                        <React.Fragment key={`${id}:${pokemon.name}`}>
                          <CommandItem
                            value={pokemon.name}
                            onSelect={handleSelectPokemon}
                            data-cy={`${pokemon.name}-value`}
                          >
                            {parseNames(pokemon.name)}
                          </CommandItem>
                          <Separator />
                        </React.Fragment>
                      )}
                    </For>
                  )}
                </ScrollArea>
              </CommandGroup>
            </Command>
          ) : null}
        </PopoverContent>
      </Popover>
    )
  },
)

//TODO: Improve the UI on this.
function CurrentNodeInformationCard(props: {
  currentNode: BreedNode
  gender: GenderType | null
  setGender: (gender: GenderType) => void
  children?: React.ReactNode
}) {
  function onCheckedChange(value: boolean) {
    props.setGender(value ? Gender.FEMALE : Gender.MALE)
  }
  return (
    <Card className="w-64 h-fit">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg text-center">
          {props.currentNode.pokemon?.name ?? (
            <HelpCircle className="mx-auto" size={32} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col items-center">
        <div className="flex flex-col gap-1 items-center">
          {Boolean(props.currentNode.ivs) ? <p>Ivs:</p> : null}
          {props.currentNode.ivs?.map((iv) => (
            <span key={randomString(4)}>31 {camelToSpacedPascal(iv)}</span>
          ))}
        </div>
        {props.currentNode.nature && (
          <i className="block">{props.currentNode.nature}</i>
        )}
        {props.currentNode.pokemon ? (
          <React.Fragment>
            <div className="text-center flex flex-col gap-1">
              <p>Egg Groups:</p>
              {props.currentNode.pokemon.eggTypes.map((egg) => (
                <span key={randomString(3)}>{egg}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <Male className="fill-blue-500 h-6 w-fit" />
              <Switch
                className="data-[state=unchecked]:bg-primary"
                checked={props.gender === Gender.FEMALE}
                onCheckedChange={onCheckedChange}
              />
              <Female className="fill-pink-500 h-6 w-fit -ml-1" />
            </div>
          </React.Fragment>
        ) : null}
        {props.children}
      </CardContent>
    </Card>
  )
}
