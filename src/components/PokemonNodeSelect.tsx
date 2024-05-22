"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from "@/core/consts"
import { useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import { PokemonEggGroup, PokemonGender, PokemonSpecies, PokemonSpeciesUnparsed } from "@/core/pokemon"
import type { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import { getPokemonSpriteUrl } from "@/lib/sprites"
import { Check } from "lucide-react"
import React from "react"
import { useMediaQuery } from "usehooks-ts"
import { getColorsByIvs } from "./PokemonIvColors"
import { PokemonNodeInfo } from "./PokemonNodeInfo"
import { IV_COLOR_DICT, IvColor, NODE_SCALE_BY_COLOR_AMOUNT, SPRITE_SCALE_BY_COLOR_AMOUNT } from "./consts"
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer"

enum SearchMode {
    All,
    EggGroupMatches,
}

export function PokemonNodeSelect(props: {
    desired31IvCount: number
    position: PokemonBreedTreePosition
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
}) {
    const id = React.useId()
    const ctx = useBreedTreeContext()
    const [pending, startTransition] = React.useTransition()
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [searchMode, setSearchMode] = React.useState(SearchMode.All)
    const [search, setSearch] = React.useState("")
    const [colors, setColors] = React.useState<IvColor[]>([])
    const isPokemonToBreed = props.position.col === 0 && props.position.row === 0
    const currentNode = props.breedTree[props.position.key()]
    assert(currentNode, "Current node should exist in PokemonNodeSelect")

    function setPokemonSpecies(species: PokemonSpeciesUnparsed) {
        assert(currentNode, `Node at ${props.position} should exist`)
        currentNode.setSpecies(PokemonSpecies.parse(species))

        switch (true) {
            case currentNode.isDitto():
                currentNode.setGender(PokemonGender.Genderless)
                break
            case currentNode.isGenderless():
                currentNode.setGender(PokemonGender.Genderless)
                break
            case currentNode.species!.percentageMale === 0:
                currentNode.setGender(PokemonGender.Female)
                break
            case currentNode.species!.percentageMale === 100:
                currentNode.setGender(PokemonGender.Male)
                break
            case currentNode.gender === PokemonGender.Genderless:
                //this means that previously at this node there was a Genderless Pokemon
                currentNode.setGender(undefined)
                break
        }

        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleSearchModeChange() {
        startTransition(() => {
            setSearchMode((prev) => (prev === SearchMode.All ? SearchMode.EggGroupMatches : SearchMode.All))
        })
    }

    const filterPokemonByEggGroups = React.useCallback((): PokemonSpeciesUnparsed[] => {
        assert(ctx.breedTarget.species, "Pokemon in context should exist")
        const newList: PokemonSpeciesUnparsed[] = []

        const ditto = ctx.pokemonSpeciesUnparsed.find((poke) => poke.number === 132)
        assert(ditto, "Ditto should exist")
        newList.push(ditto)

        if (ctx.breedTarget.species.eggGroups.includes(PokemonEggGroup.Genderless)) {
            const breedable =
                GENDERLESS_POKEMON_EVOLUTION_TREE[
                    ctx.breedTarget.species.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE
                ]

            return newList.concat(ctx.pokemonSpeciesUnparsed.filter((poke) => breedable.includes(poke.number)))
        }

        for (const poke of ctx.pokemonSpeciesUnparsed) {
            if (!poke.eggGroups.some((e) => ctx.breedTarget.species!.eggGroups.includes(e))) {
                continue
            }

            newList.push(poke)
        }

        return newList
    }, [ctx.breedTarget.species, ctx.pokemonSpeciesUnparsed])

    const pokemonList = React.useMemo(() => {
        return searchMode === SearchMode.All ? ctx.pokemonSpeciesUnparsed : filterPokemonByEggGroups()
    }, [filterPokemonByEggGroups, searchMode, ctx.pokemonSpeciesUnparsed])

    React.useEffect(() => {
        if (!currentNode || colors.length > 0) return

        const newColors: IvColor[] = []

        if (currentNode.nature) {
            newColors.push(IV_COLOR_DICT["Nature"])
        }

        if (currentNode.ivs) {
            newColors.push(...getColorsByIvs(currentNode.ivs))
        }

        setColors(newColors)
    }, [colors.length, currentNode])

    if (isDesktop) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size={"icon"}
                        className="z-10 relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
                        style={{
                            scale: NODE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                        }}
                    >
                        {colors?.map((color) => (
                            <div
                                key={`PokemonNodeSelect:${id}:${color}`}
                                style={{
                                    height: "100%",
                                    backgroundColor: color,
                                    width: 100 / colors.length,
                                }}
                            />
                        ))}
                        {currentNode?.species ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={getPokemonSpriteUrl(currentNode.species.name)}
                                style={{
                                    imageRendering: "pixelated",
                                    scale: SPRITE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                                }}
                                alt={currentNode.species.name}
                                className="mb-1 absolute"
                            />
                        ) : null}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 flex gap-4 w-full max-w-2xl bg-transparent border-none shadow-none">
                    {currentNode ? (
                        <PokemonNodeInfo
                            desired31IvCount={props.desired31IvCount}
                            breedTree={props.breedTree}
                            updateBreedTree={props.updateBreedTree}
                            currentNode={currentNode}
                        />
                    ) : null}
                    {!isPokemonToBreed ? (
                        <Command className="w-full max-w-lg border">
                            <CommandInput
                                placeholder="Search pokemon..."
                                value={search}
                                onValueChange={setSearch}
                                data-cy="search-pokemon-input"
                            />
                            <div className="flex items-center pl-3 gap-2 text-xs text-foreground/80 p-2 border-b">
                                <Checkbox
                                    className="border-foreground/50"
                                    checked={searchMode === SearchMode.EggGroupMatches}
                                    onCheckedChange={handleSearchModeChange}
                                />
                                Show only {ctx.breedTarget.species?.name}&apos;s egg groups
                            </div>
                            <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-72 w-full">
                                    {pending
                                        ? Array.from({ length: 9 }).map((_, i) => (
                                              <CommandItem
                                                  key={`PokemonNodeSelectCommandItemPending${id}:${i}`}
                                                  value={""}
                                                  onSelect={() => {}}
                                              />
                                          ))
                                        : pokemonList
                                              .filter((pokemon) =>
                                                  pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                              )
                                              .map((pokemon) => (
                                                  <CommandItem
                                                      key={`PokemonNodeSelectCommandItem${id}:${pokemon.name}`}
                                                      value={pokemon.name}
                                                      onSelect={() => setPokemonSpecies(pokemon)}
                                                      data-cy={`${pokemon.name}-value`}
                                                      className="pl-8 relative"
                                                  >
                                                      {currentNode.species?.name === pokemon.name ? (
                                                          <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
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
                    className="z-10 relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
                    style={{
                        scale: NODE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                    }}
                >
                    {colors?.map((color) => (
                        <div
                            key={`PokemonNodeSelect:${id}:${color}`}
                            style={{
                                height: "100%",
                                backgroundColor: color,
                                width: 100 / colors.length,
                            }}
                        />
                    ))}
                    {currentNode?.species ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={getPokemonSpriteUrl(currentNode.species.name)}
                            style={{
                                imageRendering: "pixelated",
                                scale: SPRITE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                            }}
                            alt={currentNode.species.name}
                            className="mb-1 absolute"
                        />
                    ) : null}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4 flex flex-col border-none gap-4 bg-transparent">
                {!isPokemonToBreed ? (
                    <Command className="w-full border">
                        <CommandInput
                            placeholder="Search pokemon..."
                            value={search}
                            onValueChange={setSearch}
                            data-cy="search-pokemon-input"
                        />
                        <div className="flex items-center pl-3 gap-2 text-xs text-foreground/80 p-2 border-b">
                            <Checkbox
                                className="border-foreground/50"
                                checked={searchMode === SearchMode.EggGroupMatches}
                                onCheckedChange={handleSearchModeChange}
                            />
                            Show only {ctx.breedTarget.species?.name}&apos;s egg groups
                        </div>
                        <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-52 w-full">
                                {pending
                                    ? Array.from({ length: 9 }).map((_, i) => (
                                          <CommandItem
                                              key={`PokemonNodeSelectCommandItemPending${id}:${i}`}
                                              value={""}
                                              onSelect={() => {}}
                                          />
                                      ))
                                    : pokemonList
                                          .filter((pokemon) =>
                                              pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                          )
                                          .map((pokemon) => (
                                              <CommandItem
                                                  key={`PokemonNodeSelectCommandItem${id}:${pokemon.name}`}
                                                  value={pokemon.name}
                                                  onSelect={() => setPokemonSpecies(pokemon)}
                                                  data-cy={`${pokemon.name}-value`}
                                                  className="pl-8 relative"
                                              >
                                                  {currentNode.species?.name === pokemon.name ? (
                                                      <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
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
