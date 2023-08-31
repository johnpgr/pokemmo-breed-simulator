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
import { IV } from "@/context/types"
import { Pokemon, PokemonSelectList } from "@/data/types"
import {
  camelToSpacedPascal,
  getSprite,
  isEven,
  parseNames,
  raise,
  randomString,
} from "@/lib/utils"
import { HelpCircle, Loader } from "lucide-react"
import { For, block } from "million/react"
import React from "react"
import { Gender } from "../consts"
import type { BreedNode, GenderType, Position } from "../types"
import type { useBreedMap } from "../use-breed-map"
import {
  GenderlessPokemonEvolutionTree,
  getBreedPartnerPosition as getBreedingPartnerPosition,
} from "../utils"
import { Color, ColorMap } from "./iv-colors"
import { HeldItemsView } from "./held-items"

const NodeScaleByColorAmount = {
  "5": 1,
  "4": 0.9,
  "3": 0.8,
  "2": 0.75,
  "1": 0.66,
} as const

const SpriteScaleByColorAmount = {
  "5": 1,
  "4": 1.1,
  "3": 1.2,
  "2": 1.3,
  "1": 1.5,
} as const

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
  return ivs.map((iv) => ColorMap[iv])
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

    async function handleSelectPokemon(name: string) {
      const pokemon = await getPokemonByName(name)
      if (!pokemon) return

      setSelectedPokemon(pokemon)

      const node = breedMap.get(position)
      if (!node) return

      const newNode = {
        gender: node.gender,
        ivs: node.ivs,
        nature: node.nature,
        parents: node.parents,
        pokemon,
      } satisfies BreedNode

      breedMap.set(position, newNode)
      setCurrentNode(newNode)
      setIsOpen(false)
    }

    function handleChangeGender(gender: GenderType) {
      setGender(gender)

      if (!selectedPokemon) return

      const node = breedMap.get(position)
      if (!node) return

      breedMap.set(position, {
        ...node,
        gender,
      })
    }

    function handleSearchModeChange() {
      startTransition(() => {
        setSearchMode((prev) => (prev === "ALL" ? "EGG_GROUP" : "ALL"))
      })
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

      const colors: Array<Color> = []

      if (currentNode.nature) {
        colors.push(ColorMap["nature"])
      }

      if (currentNode.ivs) {
        colors.push(...getColorsForCurrentNode(currentNode.ivs))
      }

      setColors(colors)
    }, [currentNode])

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            className="relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
            style={{
              scale:
                NodeScaleByColorAmount[
                  String(colors.length) as keyof typeof NodeScaleByColorAmount
                ],
            }}
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
                  scale:
                    SpriteScaleByColorAmount[
                      String(
                        colors.length,
                      ) as keyof typeof SpriteScaleByColorAmount
                    ],
                }}
                className="mb-1 absolute"
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
              breedMap={breedMap}
              position={position}
            />
          ) : null}
          {!isPokemonToBreed ? (
            <Command className="w-72 border">
              <CommandInput
                placeholder="Search pokemon..."
                value={search}
                onValueChange={setSearch}
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

class BreedPartnerIsNatureOnly {}

//TODO: Improve the UI on this.
function CurrentNodeInformationCard(props: {
  currentNode: BreedNode
  gender: GenderType | null
  setGender: (gender: GenderType) => void
  position: Position
  breedMap: ReturnType<typeof useBreedMap>
}) {
  function onCheckedChange(value: boolean) {
    props.setGender(value ? Gender.FEMALE : Gender.MALE)
  }

  function getIVDifferenceFromBreedPartner(
    self: Array<IV>,
    breedPartner: Array<IV> | BreedPartnerIsNatureOnly,
  ): IV {
    if (breedPartner instanceof BreedPartnerIsNatureOnly) {
      //This means that self is one iv only, so get the first element is fine
      return self[0]
    }

    const ivThatDoesntExistOnBreedPartner = self.filter(
      (iv) => !breedPartner.includes(iv),
    )

    return ivThatDoesntExistOnBreedPartner[0]
  }

  const breedPartnerPos =
    props.position === "0,0" ? null : getBreedingPartnerPosition(props.position)
  const IVsFromBreedPartner = breedPartnerPos
    ? props.breedMap.get(breedPartnerPos)?.ivs ?? new BreedPartnerIsNatureOnly()
    : null

  const ivDifferenceFromBreedPartner =
    IVsFromBreedPartner &&
    props.currentNode.ivs &&
    getIVDifferenceFromBreedPartner(props.currentNode.ivs, IVsFromBreedPartner)

  return (
    <Card className="w-fit h-fit relative">
      <CardHeader className="pb-2 pt-4">
        <HeldItemsView
          item={
            //if not natured, ivs must exist.
            props.currentNode.nature ? "nature" : ivDifferenceFromBreedPartner!
          }
        />
        <CardTitle className="flex items-center">
          {props.currentNode.pokemon ? (
            <React.Fragment>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getSprite(props.currentNode.pokemon.name)}
                style={{
                  imageRendering: "pixelated",
                }}
                alt={props.currentNode.pokemon.name}
                className="mb-1"
              />
              {props.currentNode.pokemon.name}
            </React.Fragment>
          ) : (
            <HelpCircle size={32} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
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
      </CardContent>
    </Card>
  )
}
