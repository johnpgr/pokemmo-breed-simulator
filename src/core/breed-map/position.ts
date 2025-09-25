import { assert } from "@/lib/utils"

export type PokemonBreedMapPositionKey = string

export class PokemonBreedMapPosition {
  row: number
  col: number

  constructor(row: number, col: number) {
    this.row = row
    this.col = col
  }

  get key(): PokemonBreedMapPositionKey {
    return `${this.row},${this.col}`
  }

  static fromKey(key: PokemonBreedMapPositionKey): PokemonBreedMapPosition {
    const [row, col] = key.split(",").map(Number)
    assert(row !== undefined, "Tried to make a key from invalid string")
    assert(col !== undefined, "Tried to make a key from invalid string")
    assert(!isNaN(row) && !isNaN(col), "Invalid BreedTreeNode key")

    return new PokemonBreedMapPosition(row, col)
  }
}
