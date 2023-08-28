"use client"
import { usePokemonToBreed } from "../_context/hooks"
import { columnsPerRow } from "./consts"
import PokemonSelect from "./select"
import { Position } from "./types"
import { useBreedMap } from "./use-breed-map"

const PokemonTree = (props: {
  pokemons: { name: string; number: number }[]
}) => {
  const { pokemon, nature, ivs } = usePokemonToBreed()

  const ivsArray = Object.values(ivs).filter(Boolean)
  const numberOf31IvPokemon = ivsArray.length as 2 | 3 | 4 | 5

  const generations = (
    nature ? numberOf31IvPokemon! + 1 : numberOf31IvPokemon
  ) as 2 | 3 | 4 | 5 | 6

  const breedMap = useBreedMap({
    selectedPokemonIVs: ivs!,
    nature,
    pokemonToBreed: {
      pokemon: pokemon!,
      nature,
      ivs: ivsArray,
      parents: null,
      gender: null,
    },
    numberOf31IvPokemon,
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
