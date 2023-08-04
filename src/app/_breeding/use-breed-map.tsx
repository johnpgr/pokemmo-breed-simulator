'use client'
import { useState } from 'react'
import { BreedNode, Position, columnsPerRow, BreedMap } from './types'

export function useBreedMap(props: {
  generations: 2 | 3 | 4 | 5 | 6
  pokemonToBreed: BreedNode
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

  return {
    map,
    set,
    get,
    remove,
  }
}
