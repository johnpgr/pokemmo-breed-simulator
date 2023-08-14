'use client'
import { usePokemonToBreed } from '../_context/hooks'
import PokemonSelect from './select'
import { Position } from './types'
import { useBreedMap } from './use-breed-map'

const PokemonTree = (props: {
  pokemons: { name: string; number: number }[]
}) => {
  const { pokemon, nature, ivs } = usePokemonToBreed()

  const numberOf31IVs = ivs?.length

  const generations = nature ? numberOf31IVs + 1 : numberOf31IVs

  const breedMap = useBreedMap({
    generations: generations as 2 | 3 | 4 | 5 | 6,
    pokemonToBreed: {
      pokemon: pokemon!,
      nature,
      ivs,
      parent: null,
      sibling: null,
      children: null,
      gender: null,
    },
  })

  return (
    <div className="flex flex-col-reverse items-center gap-32">
      {Array.from({ length: generations }).map((_, row) => (
        <div className="flex" key={`row:${row}`}>
          {Array.from({ length: columnsPerRow[row] }).map((_, column) => (
            <div key={`row:${row}col:${column}`}>
              {props.pokemons && (
                <PokemonSelect
                  pokemons={props.pokemons}
                  position={`${row},${column}` as Position}
                  set={breedMap.set}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => console.log(breedMap.map)}>Debug</button>
    </div>
  )
}

export const PokemonToBreedTree = (props: {
  pokemons: { name: string; number: number }[]
}) => {
  const ctx = usePokemonToBreed()
  if (!ctx.pokemon || !ctx.ivs) return null
  return <PokemonTree pokemons={props.pokemons} />
}
