'use client'
import { useState } from 'react'
import { useMount } from '@/lib/hooks/use-mount'
import { BreedNode, Rows, Position, columnsPerRow } from './types'

export function useBreedMap(props: { generations: Rows }) {
  const [map, setMap] = useState(Map<string, BreedNode | null>())

  function getMapKey(position: Position) {
    return position.join(',')
  }

  function set(key: Position, value: BreedNode | null) {
    setMap((prevMap) => prevMap.set(getMapKey(key), value))
  }

  function get(key: Position): BreedNode | null {
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
