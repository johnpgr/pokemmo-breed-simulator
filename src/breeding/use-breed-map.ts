"use client"

import type { IV, IVMap } from "@/context/types"
import { NatureType } from "@/data/types"
import { useMount } from "@/lib/hooks/use-mount"
import { ObservableMap } from "mobx"
import { LastRowMapping, columnsPerRow, pokemonIVsPositions } from "./consts"
import { BreedNode, Position } from "./types"

export function useBreedMap(props: {
  ivMap: IVMap
  numberOf31IvPokemon: 2 | 3 | 4 | 5
  pokemonToBreed: BreedNode
  nature: NatureType | null
}) {
  const map = new ObservableMap<Position, BreedNode>([
    ["0,0", props.pokemonToBreed],
  ])

  function setLastRow(lastRowMapping: LastRowMapping) {
    Object.entries(lastRowMapping).forEach(([key, value]) => {
      if (value === "nature") {
        map.set(key as Position, {
          nature: props.nature,
          ivs: null,
          gender: null,
          parents: null,
          pokemon: null,
        })
        return
      }
      if (props.ivMap[value]) {
        map.set(key as Position, {
          pokemon: null,
          parents: null,
          gender: null,
          ivs: [props.ivMap[value]!],
          nature: null,
        })
      }
    })
  }

  /* This function should be called after setFirstRowIvs.
   * It will set the remaining rows of the map with the correct IVs based on their parents. (Pokemon's that are directly above them in the breed tree)
   * Iterates through all rows starting from the second last row and inserts the correct IVs based on the two direct parents.
   */
  function setRemainingRows() {
    const numberOfRows = props.nature
      ? props.numberOf31IvPokemon + 1
      : props.numberOf31IvPokemon

    // Iterate through all rows starting from the second last row.
    for (let row = numberOfRows - 2; row > 0; row--) {
      // Iterate through all columns in the current row.
      for (let col = 0; col < columnsPerRow[row]; col++) {
        // console.log({ row, col })
        const key = `${row},${col}` as Position

        const parent1Pos = `${row + 1},${col * 2}` as Position
        const parent2Pos = `${row + 1},${col * 2 + 1}` as Position
        const parent1 = map.get(parent1Pos)
        const parent2 = map.get(parent2Pos)

        const ivs: Array<IV> = []
        if (parent1?.ivs) ivs.push(...parent1.ivs)
        if (parent2?.ivs) ivs.push(...parent2.ivs)

        let nature: NatureType | null = null
        if (parent1?.nature) nature = parent1.nature
        if (parent2?.nature) nature = parent2.nature

        map.set(key as Position, {
          pokemon: null,
          parents: [parent1Pos, parent2Pos],
          gender: null,
          ivs: Array.from(new Set(ivs)),
          nature,
        })
      }
    }
  }

  useMount(() => {
    const lastRowMapping = props.nature
      ? pokemonIVsPositions[props.numberOf31IvPokemon].natured
      : pokemonIVsPositions[props.numberOf31IvPokemon].natureless

    setLastRow(lastRowMapping)
    setRemainingRows()
  })

  return map
}
