"use client"
import { getPokemonByName } from "@/actions/pokemon-by-name"
import { Button } from "@/components/ui/button"
import { usePokemonToBreed } from "@/context/hooks"
import { Pokemon, PokemonSelectList } from "@/data/types"
import React from "react"
import { columnsPerRow } from "../consts"
import { Position } from "../types"
import { useBreedMap } from "../use-breed-map"
import { IvColors } from "./iv-colors"
import { PokemonSelect } from "./pokemon-select"
import { useBreedRequester } from "../use-breed-requester"

function PokemonTree(props: { pokemons: PokemonSelectList; getPokemonByName: typeof getPokemonByName }) {
  const [selectedPokemons, setSelectedPokemons] = React.useState<Array<Pokemon & { position: Position }>>([])
  const { pokemon, nature, ivMap } = usePokemonToBreed()
  const ivsArray = Object.values(ivMap).filter(Boolean)
  const numberOf31IvPokemon = ivsArray.length as 2 | 3 | 4 | 5
  const generations = (nature ? numberOf31IvPokemon! + 1 : numberOf31IvPokemon) as 2 | 3 | 4 | 5 | 6

  const { breedRequest } = useBreedRequester()

  const breedMap = useBreedMap({
    ivMap,
    nature,
    pokemonToBreed: {
      pokemon: pokemon!,
      nature,
      ivs: ivsArray,
      //this is fine because this will always be the correct parents
      parents: ["1,0", "1,1"],
      gender: null,
    },
    numberOf31IvPokemon,
    setSelectedPokemons,
    breedRequest,
  })

  return (
    <div className="flex flex-col-reverse items-center gap-8">
      {Array.from({ length: generations }).map((_, row) => (
        <div className="flex" key={`row:${row}`}>
          {Array.from({ length: columnsPerRow[row] }).map((_, column) => {
            const position = `${row},${column}` as Position
            const selectedPokemon = selectedPokemons.find((p) => p.position === position)
            return (
              <div key={`row:${row}col:${column}`}>
                {props.pokemons && (
                  <PokemonSelect
                    getPokemonByName={getPokemonByName}
                    pokemons={props.pokemons}
                    position={position}
                    breedMap={breedMap}
                    selectedPokemon={selectedPokemon}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}
      <Button onClick={() => console.log(breedMap.toJSON())}>Debug</Button>
      <IvColors ivs={ivMap} nature={nature} />
    </div>
  )
}

export function PokemonToBreedTree(props: { pokemons: PokemonSelectList; getPokemonByName: typeof getPokemonByName }) {
  const ctx = usePokemonToBreed()
  if (!ctx.pokemon || !ctx.ivMap) return null
  return <PokemonTree getPokemonByName={getPokemonByName} pokemons={props.pokemons} />
}
