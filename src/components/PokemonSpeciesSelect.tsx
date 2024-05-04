"use client"
import React from "react"
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
import { getPokemonSpriteUrl } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { PokemonSpecies, PokemonSpeciesUnparsed } from "@/core/pokemon"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"

export function PokemonSpeciesSelect(props: {
    pokemons: PokemonSpeciesUnparsed[]
    currentSelectedNode: PokemonNodeInSelect
    setCurrentSelectedNode: React.Dispatch<
        React.SetStateAction<PokemonNodeInSelect>
    >
}) {
    const [search, setSearch] = React.useState("")

    return (
        <div>
            <p className="text-foreground/70 text-sm pb-1">
                What Pokemon species?
            </p>
            <Popover>
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
                                src={getPokemonSpriteUrl(
                                    props.currentSelectedNode.species?.name,
                                )}
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={props.currentSelectedNode.species.name}
                            />
                        ) : null}
                        {props.currentSelectedNode?.species
                            ? props.currentSelectedNode.species.name
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
                                {props.pokemons
                                    .filter((pokemon) =>
                                        pokemon.name
                                            .toLowerCase()
                                            .includes(search.toLowerCase()),
                                    )
                                    .map((pokemon) => (
                                        <CommandItem
                                            key={`pokemon_to_breed:${pokemon.name}`}
                                            value={pokemon.name}
                                            onSelect={() => {
                                                props.setCurrentSelectedNode(
                                                    (prev) => ({
                                                        ...prev,
                                                        species:
                                                            PokemonSpecies.parse(
                                                                pokemon,
                                                            ),
                                                    }),
                                                )
                                            }}
                                            data-cy={`${pokemon.name}-value`}
                                            className="pl-8 relative"
                                        >
                                            {props.currentSelectedNode.species
                                                ?.name === pokemon.name ? (
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
