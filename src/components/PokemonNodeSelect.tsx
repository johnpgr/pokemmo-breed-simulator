"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CurrentNodeInfoCard } from "./CurrentNodeInfoCard"
import { PokemonEggGroup, PokemonGender, PokemonSpecies, PokemonSpeciesUnparsed } from "@/core/pokemon"
import { type Color, getColorsByIvs, COLOR_MAP } from "./IvColors"
import type { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { usePokemonToBreed } from "./PokemonToBreedContext"
import { assert } from "@/lib/assert"
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from "@/core/consts"
import { getPokemonSpriteUrl, randomString } from "@/lib/utils"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { Checkbox } from "@/components/ui/checkbox"

export function PokemonNodeSelect(props: {
    pokemons: PokemonSpeciesUnparsed[]
    position: PokemonBreedTreePosition
    breedTree: PokemonBreedTreeMap
    setBreedTree: React.Dispatch<React.SetStateAction<PokemonBreedTreeMap>>
}) {
    const id = React.useId()
    const ctx = usePokemonToBreed()
    const [pending, startTransition] = React.useTransition()
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchMode, setSearchMode] = React.useState(SearchMode.All)
    const [search, setSearch] = React.useState("")
    const [colors, setColors] = React.useState<Color[]>([])
    const isPokemonToBreed = props.position.col === 0 && props.position.row === 0
    const currentNode = props.breedTree[props.position.key()]
    const pokemonList = React.useMemo(() => {
        return searchMode === SearchMode.All ? props.pokemons : filterPokemonByEggGroups()
    }, [searchMode])

    function setPokemonSpecies(name: string) {
        const pokemon = props.pokemons.find((p) => p.name.toLowerCase() === name)
        assert.exists(pokemon, `Pokemon ${name} should exist`)
        assert.exists(currentNode, `Node at ${props.position} should exist`)

        currentNode.species = PokemonSpecies.parse(pokemon)
        props.setBreedTree((prev) => ({ ...prev }))
        setIsOpen(false)
    }

    function setGender(gender: PokemonGender) {
        assert.exists(currentNode, `Node at ${props.position} should exist`)

        currentNode.gender = gender
        props.setBreedTree((prev) => ({ ...prev }))
    }

    function handleSearchModeChange() {
        startTransition(() => {
            setSearchMode((prev) => (prev === SearchMode.All ? SearchMode.EggGroupMatches : SearchMode.All))
        })
    }

    function filterPokemonByEggGroups(): PokemonSpeciesUnparsed[] {
        assert.exists(ctx.pokemon, "Pokemon in context should exist")
        const newList: PokemonSpeciesUnparsed[] = []

        const ditto = props.pokemons.find((poke) => poke.number === 132)
        assert.exists(ditto, "Ditto should exist")
        newList.push(ditto)

        if (ctx.pokemon.eggGroups.includes(PokemonEggGroup.Genderless)) {
            const breedable =
                GENDERLESS_POKEMON_EVOLUTION_TREE[ctx.pokemon.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE]

            return newList.concat(props.pokemons.filter((poke) => breedable.includes(poke.number)))
        }

        for (const poke of props.pokemons) {
            const compatible = poke.eggGroups.some((e) => ctx.pokemon!.eggGroups.includes(e))
            if (!compatible) continue

            newList.push(poke)
        }

        return newList
    }

    React.useEffect(() => {
        if (!currentNode) return
        if (colors.length > 0) return

        const newColors: Color[] = []

        if (currentNode.nature) {
            newColors.push(COLOR_MAP["Nature"])
        }

        if (currentNode.ivs) {
            newColors.push(...getColorsByIvs(currentNode.ivs))
        }

        setColors(newColors)
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    size={"icon"}
                    className="z-10 relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
                    style={{
                        scale: NODE_SCALE_BY_COLOR_AMOUNT[
                            String(colors?.length ?? 1) as keyof typeof NODE_SCALE_BY_COLOR_AMOUNT
                        ],
                    }}
                >
                    {colors?.map((color) => (
                        <div
                            key={randomString(3)}
                            style={{
                                height: "100%",
                                backgroundColor: color,
                                width: 100 / colors.length,
                            }}
                        />
                    ))}
                    {currentNode?.species ? (
                        <img
                            src={getPokemonSpriteUrl(currentNode.species.name)}
                            style={{
                                imageRendering: "pixelated",
                                scale: SPRITE_SCALE_BY_COLOR_AMOUNT[
                                    String(colors?.length ?? 1) as keyof typeof SPRITE_SCALE_BY_COLOR_AMOUNT
                                ],
                            }}
                            className="mb-1 absolute"
                        />
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 flex gap-4 max-w-lg w-full border-none bg-transparent shadow-none">
                {currentNode ? (
                    <CurrentNodeInfoCard
                        breedTree={props.breedTree}
                        setBreedTree={props.setBreedTree}
                        currentNode={currentNode}
                        setGender={setGender}
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
                        <div className="flex items-center gap-2 text-xs text-foreground/80 p-2 border-b">
                            <Checkbox
                                className="border-foreground/50"
                                checked={searchMode === SearchMode.EggGroupMatches}
                                onCheckedChange={handleSearchModeChange}
                            />
                            Show only {ctx.pokemon?.name}&apos;s egg groups
                        </div>
                        <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72">
                                {pending
                                    ? Array.from({ length: 9 }).map((_, i) => (
                                          <React.Fragment key={`${id}:${i}`}>
                                              <CommandItem value={""} onSelect={() => {}}></CommandItem>
                                              <Separator />
                                          </React.Fragment>
                                      ))
                                    : pokemonList
                                          .filter((pokemon) =>
                                              pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                          )
                                          .map((pokemon) => (
                                              <React.Fragment key={`${id}:${pokemon.name}`}>
                                                  <CommandItem
                                                      value={pokemon.name}
                                                      onSelect={setPokemonSpecies}
                                                      data-cy={`${pokemon.name}-value`}
                                                  >
                                                      {pokemon.name}
                                                  </CommandItem>
                                                  <Separator />
                                              </React.Fragment>
                                          ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    )
}

enum SearchMode {
    All,
    EggGroupMatches,
}

const NODE_SCALE_BY_COLOR_AMOUNT = {
    "5": "100%",
    "4": "90%",
    "3": "80%",
    "2": "75%",
    "1": "66%",
} as const

const SPRITE_SCALE_BY_COLOR_AMOUNT = {
    "5": "100%",
    "4": "110%",
    "3": "120%",
    "2": "130%",
    "1": "150%",
} as const
