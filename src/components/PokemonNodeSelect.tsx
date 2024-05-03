"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PokemonNodeInfo } from "./PokemonNodeInfo"
import { PokemonEggGroup, PokemonGender, PokemonSpecies, PokemonSpeciesUnparsed } from "@/core/pokemon"
import { getColorsByIvs } from "./PokemonIvColors"
import type { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import { usePokemonToBreed } from "./PokemonToBreedContext"
import { assert } from "@/lib/assert"
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from "@/core/consts"
import { getPokemonSpriteUrl, randomString } from "@/lib/utils"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { Checkbox } from "@/components/ui/checkbox"
import { Check } from "lucide-react"
import { NODE_SCALE_BY_COLOR_AMOUNT, SPRITE_SCALE_BY_COLOR_AMOUNT, IV_COLOR_DICT, IvColor } from "./consts"

enum SearchMode {
    All,
    EggGroupMatches,
}

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
    const [colors, setColors] = React.useState<IvColor[]>([])
    const isPokemonToBreed = props.position.col === 0 && props.position.row === 0
    const currentNode = props.breedTree[props.position.key()]
    assert.exists(currentNode, "Current node should exist in PokemonNodeSelect")

    function setPokemonSpecies(name: string) {
        const pokemon = props.pokemons.find((p) => p.name.toLowerCase() === name)
        assert.exists(pokemon, `Pokemon ${name} should exist`)
        assert.exists(currentNode, `Node at ${props.position} should exist`)

        currentNode.species = PokemonSpecies.parse(pokemon)
        if (currentNode.species?.percentageMale === 0) {
            currentNode.gender = PokemonGender.Genderless
        } else if (currentNode.gender === PokemonGender.Genderless) {
            //this means that previously at this node there was a genderless pokemon
            currentNode.gender = undefined
        }

        props.setBreedTree((prev) => ({ ...prev }))
        setIsOpen(false)
    }

    function setGender(gender?: PokemonGender) {
        assert.exists(currentNode, `Node at ${props.position} should exist`)

        currentNode.gender = gender
        props.setBreedTree((prev) => ({ ...prev }))
    }

    function handleSearchModeChange() {
        startTransition(() => {
            setSearchMode((prev) => (prev === SearchMode.All ? SearchMode.EggGroupMatches : SearchMode.All))
        })
    }

    const filterPokemonByEggGroups = React.useCallback((): PokemonSpeciesUnparsed[] => {
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
            if (!poke.eggGroups.some((e) => ctx.pokemon!.eggGroups.includes(e))) {
                continue
            }

            newList.push(poke)
        }

        return newList
    }, [ctx.pokemon, props.pokemons])

    const pokemonList = React.useMemo(() => {
        return searchMode === SearchMode.All ? props.pokemons : filterPokemonByEggGroups()
    }, [filterPokemonByEggGroups, searchMode, props.pokemons])

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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={getPokemonSpriteUrl(currentNode.species.name)}
                            style={{
                                imageRendering: "pixelated",
                                scale: SPRITE_SCALE_BY_COLOR_AMOUNT[
                                    String(colors?.length ?? 1) as keyof typeof SPRITE_SCALE_BY_COLOR_AMOUNT
                                ],
                            }}
                            alt={currentNode.species.name}
                            className="mb-1 absolute"
                        />
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 flex gap-4 w-full max-w-2xl border-none bg-transparent shadow-none">
                {currentNode ? (
                    <PokemonNodeInfo
                        breedTree={props.breedTree}
                        setBreedTree={props.setBreedTree}
                        currentNode={currentNode}
                        setGender={setGender}
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
                            Show only {ctx.pokemon?.name}&apos;s egg groups
                        </div>
                        <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72 w-full">
                                {pending
                                    ? Array.from({ length: 9 }).map((_, i) => (
                                          <CommandItem key={`${id}:${i}`} value={""} onSelect={() => {}}></CommandItem>
                                      ))
                                    : pokemonList
                                          .filter((pokemon) =>
                                              pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                          )
                                          .map((pokemon) => (
                                              <CommandItem
                                                  key={`${id}:${pokemon.name}`}
                                                  value={pokemon.name}
                                                  onSelect={setPokemonSpecies}
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
