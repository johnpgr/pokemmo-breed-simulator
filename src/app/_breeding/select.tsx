'use client'
import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'
import { Pokemon } from '@/data/types'
import { getSprite } from '@/lib/utils'
import { For, block } from 'million/react'
import { Fragment, useId, useRef, useState } from 'react'
import type { Gender, Node, Position } from './use-breed-map'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'

const getPokemon = async (name: string) => {
  const res = await fetch(`http://localhost:3000/api/pokemons/${name}`)
  return res.json() as Promise<Pokemon>
}

const parseNames = (name: string) => {
  switch (name) {
    case 'Nidoran-f':
      return 'Nidoran ♀'
    case 'Nidoran-m':
      return 'Nidoran ♂'
    default:
      return name
  }
}

const PokemonSelect = block(
  (props: {
    pokemons: {
      name: string
      number: number
    }[]
    position: Position
    set: (key: Position, value: Node | null) => void
  }) => {
    const id = useId()

    const [search, setSearch] = useState<string>('')
    const [selectedPokemon, setSelectedPokemon] = useState<string | undefined>(
      undefined,
    )
    const [gender, setGender] = useState<Gender | undefined>(undefined)

    async function handleSelectPokemon(name: string) {
      console.log('handleSelectPokemon', name)
      const pokemon = await getPokemon(name)
      console.log(pokemon)
      setSelectedPokemon(pokemon.name)

      props.set(props.position, {
        gender: 'Female',
        pokemon,
      })
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button size={'icon'} className="rounded-full">
            {selectedPokemon && (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                src={getSprite(selectedPokemon)}
                style={{
                  imageRendering: 'pixelated',
                }}
                className="mb-1"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0'>
          <Command>
            <CommandInput
              placeholder='Search pokemon...'
              value={search}
              onValueChange={setSearch}
              data-cy="search-pokemon-input"
            />
            <CommandEmpty>
              No results
            </CommandEmpty>
            <CommandGroup>
              <ScrollArea className='h-72'>
              <For
                each={props.pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(search.toLowerCase()))}
              >
                {(pokemon) => (
                  <Fragment key={`${id}:${pokemon.name}`}>
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
      </Popover >
    )
  },
)

export default PokemonSelect
