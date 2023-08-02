'use client'
import { useState } from 'react'
import { Map } from 'immutable'
import { useMount } from '@/lib/hooks/use-mount'
import { Pokemon } from '@/data/types.js'

export const columnsPerRow = [1, 2, 4, 8, 16, 32] as const
export type Position = [number, number]
export type Gender = 'Male' | 'Female'

export type Node = {
  pokemon: Pokemon
  gender: Gender
}

export type Generations = 1 | 2 | 3 | 4 | 5 | 6

export function useBreedMap(props: { generations: Generations }) {
  const [map, setMap] = useState(Map<string, Node | null>())

  function getMapKey(position: Position) {
    return position.join(',')
  }

  function set(key: Position, value: Node | null) {
    setMap((prevMap) => prevMap.set(getMapKey(key), value))
  }

  function get(key: Position): Node | null {
    return map.get(getMapKey(key)) ?? null
  }

  function remove(key: Position) {
    setMap((prevMap) => prevMap.delete(getMapKey(key)))
  }

  useMount(() => {
    for (let row = 0; row < props.generations; row++) {
      for (let column = 0; column < columnsPerRow[row]; column++) {
        set([row, column], null)
      }
    }
  })

  return {
    map,
    set,
    get,
    remove,
  }
}
