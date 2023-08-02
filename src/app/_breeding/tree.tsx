'use client'
import React from 'react'
import PokemonSelect from './select'
import { Generations, columnsPerRow, useBreedMap } from './use-breed-map'
import { For, block } from 'million/react'
import { Pokemon } from '@/data/types'

const PokemonTree = block(
  (props: {
    numberOf31IVs: number
    natured: boolean
    pokemonToBreed: Pokemon
    pokemons: { name: string; number: number }[]
  }) => {
    const generations = props.natured
      ? props.numberOf31IVs + 1
      : props.numberOf31IVs
    const breedMap = useBreedMap({ generations: generations as Generations })

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
        <button onClick={() => console.log(breedMap.map)}>Debug</button>
      </div>
    )
  },
)
export default PokemonTree
