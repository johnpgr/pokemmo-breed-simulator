"use client"

import { useState } from "react"
import { BreedNode, Position, BreedMap } from "./types"
import { useMount } from "@/lib/hooks/use-mount"
import { NatureType } from "@/data/types"
import { LastRowMapping, columnsPerRow, pokemonIVsPositions } from "./consts"
import type { IV } from "@/context/types"

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
    "0,0": props.pokemonToBreed,
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

  function setLastRowIvs(map: BreedMap, lastRowMapping: LastRowMapping) {
    Object.entries(lastRowMapping).forEach(([key, value]) => {
      if (value === "nature") {
        map[key as Position] = {
          nature: props.nature,
          ivs: null,
          gender: null,
          parents: null,
          pokemon: null,
        }
        return
      }
      if (props.selectedPokemonIVs[value]) {
        map[key as Position] = {
          pokemon: null,
          parents: null,
          gender: null,
          ivs: [props.selectedPokemonIVs[value]!],
          nature: null,
        }
      }
    })
  }

  /* This function should be called after setFirstRowIvs.
   * It will set the remaining rows of the map with the correct IVs based on their parents. (Pokemon's that are directly above them in the breed tree)
   * Iterates through all rows starting from the second last row and inserts the correct IVs based on the two direct parents.
   */
  function setRemainingRowsIvs(map: BreedMap) {
    const numberOfRows = props.nature
      ? props.numberOf31IvPokemon + 1
      : props.numberOf31IvPokemon

    // Iterate through all rows starting from the second last row.
    for (let row = numberOfRows - 2; row > 0; row--) {
      // Iterate through all columns in the current row.
      for (let col = 0; col < columnsPerRow[row]; col++) {
        console.log({ row, col })
        const key = `${row},${col}` as Position

        const parent1Pos = `${row + 1},${col * 2}` as Position
        const parent2Pos = `${row + 1},${col * 2 + 1}` as Position
        const parent1 = map[parent1Pos]
        const parent2 = map[parent2Pos]

        const ivs =
          parent1.ivs && parent2.ivs ? [...parent1.ivs, ...parent2.ivs] : null

        map[key] = {
          pokemon: null,
          parents: [parent1Pos, parent2Pos],
          gender: null,
          ivs: Array.from(new Set(ivs)),
          //TODO: Set nature if parent is natured.
          nature: null,
        }
      }
    }
  }

  useMount(() => {
    const lastRowMapping = props.nature
      ? pokemonIVsPositions[props.numberOf31IvPokemon].natured
      : pokemonIVsPositions[props.numberOf31IvPokemon].natureless

    const map: BreedMap = {} as BreedMap

    setLastRowIvs(map, lastRowMapping)
    setRemainingRowsIvs(map)

    setMap((prevMap) => ({
      ...prevMap,
      ...map,
    }))
  })

  return {
    map,
    set,
    get,
    remove,
  }
}
