"use client"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PokemonSpecies, PokemonSpeciesRaw } from "@/core/pokemon"
import { getPokemonSpriteUrl } from "@/lib/sprites"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"
import { useBreedContext } from "@/core/PokemonBreedContext"

export function PokemonSpeciesSelect(props: {
    currentSelectedNode: PokemonNodeInSelect
    setCurrentSelectedNode: React.Dispatch<React.SetStateAction<PokemonNodeInSelect>>
}) {
    const ctx = useBreedContext()
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    function handleSpeciesSelect(pokemon: PokemonSpeciesRaw) {
        props.setCurrentSelectedNode((prev) => ({
            ...prev,
            species: PokemonSpecies.parse(pokemon),
        }))
        setIsOpen(false)
    }

    return (
        <div>
            <p className="text-foreground/70 text-sm pb-1">What Pokémon species?</p>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant={"ghost"}
                        className={`border ${props.currentSelectedNode.species ? "pl-2" : "pl-4"}`}
                    >
                        {props.currentSelectedNode?.species ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                className="top-[1px] left-0"
                                src={getPokemonSpriteUrl(props.currentSelectedNode.species?.name)}
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={props.currentSelectedNode.species.name}
                            />
                        ) : null}
                        {props.currentSelectedNode?.species
                            ? props.currentSelectedNode.species.name
                            : "Select a Pokemon"}
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
                                {ctx.species
                                    .map((pokemon) => (
                                        <CommandItem
                                            key={`pokemon_to_breed:${pokemon.name}`}
                                            value={pokemon.name}
                                            onSelect={() => handleSpeciesSelect(pokemon)}
                                            data-cy={`${pokemon.name}-value`}
                                            className="pl-8 relative"
                                        >
                                            {props.currentSelectedNode.species?.name === pokemon.name ? (
                                                <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                            ) : null}
                                            {pokemon.name}
                                        </CommandItem>
                                    ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
