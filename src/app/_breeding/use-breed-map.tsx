'use client'

import { useState } from 'react'
import { BreedNode, Position, BreedMap } from './types'
import { useMount } from '@/lib/hooks/use-mount'
import { NatureType } from '@/data/types'
import { pokemonIVsPositions } from './consts'
import { IV } from '../_context/types'

export function useBreedMap(props: {
  selectedPokemonIVs: {
    a: IV | null
    b: IV | null
    c: IV | null
    d: IV | null
    e: IV | null
  }
  numberOf31IvPokemon: 2 | 3 | 4 | 5
  pokemonToBreed: BreedNode
  nature: NatureType | null
}) {
  const [map, setMap] = useState<BreedMap>({
    '0,0': props.pokemonToBreed,
  } as BreedMap)

  function set(key: Position, value: BreedNode | null) {
    setMap((prevMap) => ({
      ...prevMap,
      [key]: value,
    }))
  }

  function get(key: Position): BreedNode | null {
    return map[key] || null
  }

  function remove(key: Position) {
    setMap((prevMap) => ({
      ...prevMap,
      [key]: null,
    }))
  }

  useMount(() => {
    const lastRowMapping = props.nature
      ? pokemonIVsPositions[props.numberOf31IvPokemon].natured
      : pokemonIVsPositions[props.numberOf31IvPokemon].natureless
    const lastRow: BreedMap = {} as BreedMap

    console.log({ lastRowMapping })
    console.log({ selectedPokemonIVs: props.selectedPokemonIVs })
    Object.entries(lastRowMapping).forEach(([key, value]) => {
      console.log({ key, value })
      if (value === 'nature') {
        lastRow[key as Position] = {
          nature: props.nature,
          ivs: null,
          gender: null,
          parents: null,
          pokemon: null,
        }
        return
      }
      if (props.selectedPokemonIVs[value]) {
        lastRow[key as Position] = {
          pokemon: null,
          parents: null,
          gender: null,
          ivs: [props.selectedPokemonIVs[value]!],
          nature: null,
        }
      }
    })
    console.log({ lastRow })

    setMap((prevMap) => ({
      ...prevMap,
      ...lastRow,
    }))
  })

  return {
    map,
    set,
    get,
    remove,
  }
}
