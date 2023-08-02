'use client'
import { useState } from 'react'
import { Map } from 'immutable'
import { useMount } from '@/lib/hooks/use-mount'
import { Breed, Generations, Position, columnsPerRow } from './types'

export function useBreedMap(props: { generations: Generations }) {
  const [map, setMap] = useState(Map<string, Breed | null>())

  function getMapKey(position: Position) {
    return position.join(',')
  }

  function set(key: Position, value: Breed | null) {
    setMap((prevMap) => prevMap.set(getMapKey(key), value))
  }

  function get(key: Position): Breed | null {
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
