'use client'
import React from 'react'
import PokemonSelect from './select'
import { Generations, columnsPerRow, useBreedMap } from './use-breed-map'
import { block } from 'million/react'

const PokemonTree = block(
  (props: {
    numberOf31IVs: number
    natured: boolean
    pokemons: { name: string; number: number }[]
  }) => {
    const generations = props.natured
      ? props.numberOf31IVs + 1
      : props.numberOf31IVs
    const breedMap = useBreedMap({ generations: generations as Generations })
    
    return (
      <div className="flex flex-col-reverse items-center gap-32">
        {Array.from({ length: generations }).map((_, row) => (
          <div className="flex" key={`row:${row}`}>
            {Array.from({ length: columnsPerRow[row] }).map((_, column) => {
              const pokemon = breedMap.get([row, column])
              return (
                <div key={`row:${row}col:${column}`}>
                  {props.pokemons && (
                    <PokemonSelect
                      pokemons={props.pokemons}
                      position={[row, column]}
                      set={breedMap.set}
                    />
                  )}
                  {/* {pokemon ? (
                  <PokemonCard pokemon={pokemon.pokemon} />
                ) : (
                  <div>Nothing</div>
                )} */}
                </div>
              )
            })}
          </div>
        ))}
        <button onClick={() => console.log(breedMap.map)}>Debug</button>
      </div>
    )
  },
)
export default PokemonTree
