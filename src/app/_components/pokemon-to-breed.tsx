'use client'

import { For, block } from 'million/react'
import React, { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { getPokemonByName, parseNames } from '@/lib/utils'
import { NatureType, Pokemon } from '@/data/types'
import { usePokemonToBreed } from '../_context/hooks'
import { IVs } from '../_context/types'

type Keys<T> = keyof T

export const PokemonToBreedSelector = block(
  (props: {
    pokemons: {
      name: string
      number: number
    }[]
  }) => {
    const ctx = usePokemonToBreed()
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [pokemon, setPokemon] = useState<Pokemon | null>(null)
    const [ivs, setIvs] = useState<IVs | null>(null)
    const [nature, setNature] = useState<NatureType| null>(null)

    async function handleSelectPokemon(name: string) {
      const pokemon = await getPokemonByName(name)
      setPokemon(pokemon)
    }

    function handleSelectIvs(iv: Keys<IVs>) {
      setIvs((prev) => {
        return {
          ...prev,
          [iv]: 31,
        } as IVs
      })
    }

    function handleSelectNature(nature: NatureType) {
      setNature(nature)
    }

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size={'icon'}
            className="rounded-full bg-neutral-300 dark:bg-neutral-800"
          >
            Species
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
                    <Fragment key={`pokemon_to_breed:${pokemon.name}`}>
                      <CommandItem
                        value={pokemon.name}
                        onSelect={(currentValue) => {
                          handleSelectPokemon(currentValue)
                        }}
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
