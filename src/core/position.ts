export type PokemonBreedMapPositionKey = `${number},${number}`

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

    return new PokemonBreedMapPosition(row, col)
  }
}