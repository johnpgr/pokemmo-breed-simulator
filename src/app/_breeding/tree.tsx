'use client'
import React from 'react'
import PokemonSelect from './select'
import { Generations, Breed, columnsPerRow } from './types'
import { useBreedMap } from './use-breed-map'
import { For, block } from 'million/react'
import { usePokemonToBreed } from '../_context/hooks'

const PokemonTree = block(
  (props: { pokemons: { name: string; number: number }[] }) => {
    const { pokemon, nature, ivs } = usePokemonToBreed()

    const numberOf31IVs = ivs ? Object.values(ivs).filter((v) => v === 31).length : 0

    const generations = nature ? numberOf31IVs + 1 : numberOf31IVs

    const breedMap = useBreedMap({ generations: generations as Generations })

    if(pokemon && ivs) {
      breedMap.set([0, 0], {
        pokemon,
        ivs,
        nature,
        gender: undefined
      })
    }

    function debug() {
      const debugValue = {} as Record<string, Breed | null>
      for (const [key, value] of breedMap.map.entries()) {
        debugValue[key] = value
      }
      console.log(debugValue)
    }

    return (
      <div className="flex flex-col-reverse items-center gap-32">
        <For each={Array.from({ length: generations })}>
          {(_, row) => (
            <div className="flex" key={`row:${row}`}>
              <For each={Array.from({ length: columnsPerRow[row] })}>
                {(_, column) => (
                  <div key={`row:${row}col:${column}`}>
                    {props.pokemons && (
                      <PokemonSelect
                        pokemons={props.pokemons}
                        position={[row, column]}
                        set={breedMap.set}
                      />
                    )}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
        <button onClick={debug}>Debug</button>
      </div>
    )
  },
)

export const PokemonToBreedTree = (props: {pokemons: {name: string, number: number}[]}) => {
  const ctx = usePokemonToBreed()
  if(!ctx.pokemon) return null
  return <PokemonTree pokemons={props.pokemons} />
}

