'use client'

import { useState } from 'react'
import { BreedNode, Position, BreedMap } from './types'
import { useMount } from '@/lib/hooks/use-mount'
import { NatureType } from '@/data/types'
import { pokemonIVsPositions } from './consts'
import { IV } from '../_context/types'

export function useBreedMap(props: {
  selectedPokemonIVs: IV[]
  pokemonToBreed: BreedNode
  nature: NatureType | null
}) {
  const generations = props.selectedPokemonIVs
    .length as keyof typeof pokemonIVsPositions

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
      ? pokemonIVsPositions[generations].natured
      : pokemonIVsPositions[generations].natureless
    const lastRow: BreedMap = {} as BreedMap

    Object.entries(lastRowMapping).forEach(([key, value]) => {
      if (value === 'nature') {
        lastRow[key as Position] = {
          nature: props.nature,
          ivs: null,
          gender: null,
          parents: null,
          pokemon: null,
        }
      } else if (value in props.selectedPokemonIVs) {
        //@ts-expect-error ts is dumb
        lastRow[key as Position] = props.selectedPokemonIVs[value]
          ? {
              pokemon: null,
              parents: null,
              gender: null,
              ivs: props.selectedPokemonIVs,
              nature: null,
            }
          : {
              pokemon: null,
              parents: null,
              nature: null,
              ivs: null,
              gender: null,
            }
      }
    })

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
