import { BREED_EXPECTED_COSTS, IV_COLOR_DICT, type IvColor } from "@/lib/consts"
import type { PokemonIv } from "@/core/pokemon"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const BASE_SPRITES_URL =
  "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular"
export const BASE_ITEM_SPRITES_URL =
  "https://raw.githubusercontent.com/msikma/pokesprite/master/items"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error("Assertion failed " + message)
  }
}

export function randomString(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export function pascalToSpacedPascal(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase())
}

export function kebabToSpacedPascal(input: string): string {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function capitalize(input: string) {
  assert(input[0] !== undefined)

  return input[0].toUpperCase() + input.slice(1).toLowerCase()
}

export function unreachable(msg: string): never {
  throw new Error(msg)
}

export function getColorsByIvs(ivs: PokemonIv[]): IvColor[] {
  return ivs.map((iv) => IV_COLOR_DICT[iv])
}

export function getExpectedBreedCost(
  desired31IVCount: number,
  natured: boolean
): number {
  const costsTable = BREED_EXPECTED_COSTS[desired31IVCount]
  assert(costsTable, "Expected cost must be defined")

  if (natured) {
    return costsTable.natured
  }

  return costsTable.natureless
}

export function getEvItemSpriteUrl(item: string) {
  if (item === "everstone")
    return `${BASE_ITEM_SPRITES_URL}/hold-item/${item}.png`

  return `${BASE_ITEM_SPRITES_URL}/ev-item/${item}.png`
}
