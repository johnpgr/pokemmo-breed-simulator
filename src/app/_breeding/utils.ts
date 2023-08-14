import { EggType } from "@/data/types"
import { Position } from "./types"

export function parsePosition(pos: Position) {
  const [row, col] = pos.split(',')
  return { row: parseInt(row), col: parseInt(col) }
}

export const genderlessEggtypes:Readonly<EggType[]> = ['Ditto', 'Genderless'] as const
