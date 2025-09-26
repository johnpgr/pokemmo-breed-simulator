import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  PokemonGender,
  PokemonSpecies,
  type PokemonSpeciesRaw,
} from "@/core/pokemon"
import { assert, getColorsByIvs } from "@/lib/utils"
import { Data } from "@/lib/data"
import { Check } from "lucide-react"
import React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { PokemonNodeInfo } from "./PokemonNodeInfo"
import {
  DITTO,
  IV_COLOR_DICT,
  type IvColor,
  NODE_SCALE_BY_COLOR_AMOUNT,
  SPRITE_SCALE_BY_COLOR_AMOUNT,
} from "@/lib/consts"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import type { PokemonBreedMapPosition } from "@/core/breed-map/position"
import type { PokemonBreedMap } from "@/core/breed-map"
import { BreedContext } from "@/contexts/breed-context/store"

const SearchMode = {
  All: "All",
  EggGroupMatches: "EggGroupMatches",
}
export type SearchMode = (typeof SearchMode)[keyof typeof SearchMode]

export function PokemonNodeSelect(props: {
  desired31IvCount: number
  position: PokemonBreedMapPosition
  breedTree: PokemonBreedMap
  updateBreedTree: () => void
}) {
  // no unique id needed here; using stable values for keys instead
  const ctx = React.use(BreedContext)
  const target = ctx.breedTree.rootNode
  const [pending, startTransition] = React.useTransition()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [searchMode, setSearchMode] = React.useState(SearchMode.All)
  const [search, setSearch] = React.useState("")
  const isRootNode = props.position.col === 0 && props.position.row === 0
  const currentNode = props.breedTree[props.position.key]

  assert(currentNode, "Current node should exist in PokemonNodeSelect")

  function setPokemonSpecies(species: PokemonSpeciesRaw) {
    assert(currentNode, `Node at ${props.position} should exist`)
    currentNode.species = PokemonSpecies.parse(species)

    switch (true) {
      case currentNode.species.isDitto():
        currentNode.gender = PokemonGender.Genderless
        break
      case currentNode.species.isGenderless():
        currentNode.gender = PokemonGender.Genderless
        break
      case currentNode.species?.percentageMale === 0:
        currentNode.gender = PokemonGender.Female
        break
      case currentNode.species?.percentageMale === 100:
        currentNode.gender = PokemonGender.Male
        break
      // This means that previously at this node there was a Genderless Pokemon
      case currentNode.gender === PokemonGender.Genderless:
        currentNode.gender = undefined
        break
    }

    props.updateBreedTree()
  }

  function handleSearchModeChange() {
    startTransition(() => {
      setSearchMode((prev) =>
        prev === SearchMode.All ? SearchMode.EggGroupMatches : SearchMode.All,
      )
    })
  }

  function filterPokemonByEggGroups(): PokemonSpeciesRaw[] {
    assert(target.species, "Pokemon in context should exist")
    const newList: PokemonSpeciesRaw[] = []

    newList.push(DITTO)

    if (target.species.isGenderless()) {
      const breedable = target.species.getEvolutionTree(Data.evolutions)
      return newList.concat(
        Data.species.filter((poke) => breedable.includes(poke.id)),
      )
    } else {
      const eggGroups = target.species.eggGroups
      return newList.concat(
        Data.species.filter((poke) =>
          eggGroups.some((group) => poke.eggGroups.includes(group as string)),
        ),
      )
    }
  }

  const pokemonList =
    searchMode === SearchMode.All ? Data.species : filterPokemonByEggGroups()

  const colors: IvColor[] = []

  if (currentNode.nature) {
    colors.push(IV_COLOR_DICT["Nature"])
  }

  if (currentNode.ivs) {
    colors.push(...getColorsByIvs(currentNode.ivs))
  }

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            className="relative z-10 gap-0 overflow-hidden rounded-full bg-neutral-300 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none dark:bg-neutral-800 dark:hover:ring-neutral-700 dark:focus:ring-neutral-700"
            style={{
              scale: NODE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
            }}
          >
            {colors.map((color, index) => (
              <div
                key={`PokemonNodeSelect:color:${index}`}
                style={{
                  height: "100%",
                  backgroundColor: color,
                  width: `${100 / colors.length}%`,
                }}
              />
            ))}
            {currentNode?.species ? (
              <div
                className="absolute mb-1"
                style={{
                  width: currentNode.species.spriteMeta.width,
                  height: currentNode.species.spriteMeta.height,
                  backgroundImage: `url(${Data.spritesheet})`,
                  backgroundPosition: `-${currentNode.species.spriteMeta.x}px -${currentNode.species.spriteMeta.y}px`,
                  imageRendering: "pixelated",
                  backgroundRepeat: "no-repeat",
                  scale: SPRITE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                }}
                aria-hidden
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-full max-w-2xl gap-4 border-none bg-transparent p-0 shadow-none">
          {currentNode ? (
            <PokemonNodeInfo
              desired31IvCount={props.desired31IvCount}
              breedTree={props.breedTree}
              updateBreedTree={props.updateBreedTree}
              currentNode={currentNode}
            />
          ) : null}
          {!isRootNode ? (
            <Command className="w-full max-w-lg border">
              <CommandInput
                placeholder="Search pokemon..."
                value={search}
                onValueChange={setSearch}
                data-cy="search-pokemon-input"
              />
              <div className="text-foreground/80 flex items-center gap-2 border-b p-2 pl-3 text-xs">
                <Checkbox
                  className="border-foreground/50"
                  checked={searchMode === SearchMode.EggGroupMatches}
                  onCheckedChange={handleSearchModeChange}
                />
                Show only {target.species?.name}&apos;s egg groups
              </div>
              <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72 w-full">
                  {pending
                    ? Array.from({ length: 9 }).map((_, i) => (
                        <CommandItem
                          key={`PokemonNodeSelectCommandItemPending:${i}`}
                          value={""}
                          onSelect={() => {}}
                        />
                      ))
                    : pokemonList.map((pokemon) => (
                        <CommandItem
                          key={`PokemonNodeSelectCommandItem:${pokemon.name}`}
                          value={pokemon.name}
                          onSelect={() => setPokemonSpecies(pokemon)}
                          data-cy={`${pokemon.name}-value`}
                          className="relative pl-8"
                        >
                          {currentNode.species?.name === pokemon.name ? (
                            <Check className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                          ) : null}
                          {pokemon.name}
                        </CommandItem>
                      ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          ) : null}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={"icon"}
          className="relative z-10 gap-0 overflow-hidden rounded-full bg-neutral-300 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none dark:bg-neutral-800 dark:hover:ring-neutral-700 dark:focus:ring-neutral-700"
          style={{
            scale: NODE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
          }}
        >
          {colors.map((color, index) => (
            <div
              key={`PokemonNodeSelect:color:${index}`}
              style={{
                height: "100%",
                backgroundColor: color,
                width: 100 / colors.length,
              }}
            />
          ))}
          {currentNode?.species ? (
            <div
              className="absolute mb-1"
              style={{
                width: currentNode.species.spriteMeta.width,
                height: currentNode.species.spriteMeta.height,
                backgroundImage: `url(${Data.spritesheet})`,
                backgroundPosition: `-${currentNode.species.spriteMeta.x}px -${currentNode.species.spriteMeta.y}px`,
                imageRendering: "pixelated",
                backgroundRepeat: "no-repeat",
                scale: SPRITE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
              }}
            />
          ) : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-4 border-none bg-transparent p-4">
        {!isRootNode ? (
          <Command className="w-full border">
            <CommandInput
              placeholder="Search pokemon..."
              value={search}
              onValueChange={setSearch}
              data-cy="search-pokemon-input"
            />
            <div className="text-foreground/80 flex items-center gap-2 border-b p-2 pl-3 text-xs">
              <Checkbox
                className="border-foreground/50"
                checked={searchMode === SearchMode.EggGroupMatches}
                onCheckedChange={handleSearchModeChange}
              />
              Show only {target.species?.name}&apos;s egg groups
            </div>
            <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-52 w-full">
                {pending
                  ? Array.from({ length: 9 }).map((_, i) => (
                      <CommandItem
                        key={`PokemonNodeSelectCommandItemPending:${i}`}
                        value={""}
                        onSelect={() => {}}
                      />
                    ))
                  : pokemonList
                      .filter((pokemon) =>
                        pokemon.name
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((pokemon) => (
                        <CommandItem
                          key={`PokemonNodeSelectCommandItem:${pokemon.name}`}
                          value={pokemon.name}
                          onSelect={() => setPokemonSpecies(pokemon)}
                          data-cy={`${pokemon.name}-value`}
                          className="relative pl-8"
                        >
                          {currentNode.species?.name === pokemon.name ? (
                            <Check className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                          ) : null}
                          {pokemon.name}
                        </CommandItem>
                      ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        ) : null}
        {currentNode ? (
          <PokemonNodeInfo
            desired31IvCount={props.desired31IvCount}
            breedTree={props.breedTree}
            updateBreedTree={props.updateBreedTree}
            currentNode={currentNode}
          />
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
