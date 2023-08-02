'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Pokemon } from '@/data/types'
import { getSprite } from '@/lib/utils'
import { For, block } from 'million/react'
import { Fragment, useId, useRef, useState } from 'react'
import type { Gender, Node, Position } from './use-breed-map'
import { ScrollArea } from '@/components/ui/scroll-area'

const getPokemon = async (name: string) => {
  const res = await fetch(`http://localhost:3000/api/pokemons/${name}`)
  return res.json() as Promise<Pokemon>
}

const parseNames = (name:string) => {
  switch(name){
    case 'Nidoran-f':
      return 'Nidoran♀'
    case 'Nidoran-m':
      return 'Nidoran♂'
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
  
    const [selectedPokemon, setSelectedPokemon] = useState<string | undefined>(
      undefined,
    )
    const [gender, setGender] = useState<Gender | undefined>(undefined)
    console.log(props.pokemons)

    async function handleSelectPokemon(name: string) {
      console.log('handleSelectPokemon', name)
      const pokemon = await getPokemon(name)
      setSelectedPokemon(pokemon.name)

      props.set(props.position, {
        gender: 'Female',
        pokemon,
      })
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <ScrollArea className="h-72 w-48 rounded-md">
            <For
              each={props.pokemons}
            >
              {(pokemon) => (
                <Fragment key={`${id}:${pokemon.name}`}>
                  <DropdownMenuItem
                    onSelect={() =>
                      handleSelectPokemon(
                        pokemon.name
                      )
                    }
                  >
                    {parseNames(pokemon.name)}
                  </DropdownMenuItem>
                  <Separator />
                </Fragment>
              )}
            </For>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
)

export default PokemonSelect
