import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BASE_SPRITES_URL } from "./consts"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getSprite(name: string) {
  return `${BASE_SPRITES_URL}/${name.toLowerCase()}.png`
}

export function raise(message: string): never {
  throw new Error(message)
}

export function parseNames(name: string) {
  switch (name) {
    case "Nidoran-f":
      return "Nidoran ♀"
    case "Nidoran-m":
      return "Nidoran ♂"
    default:
      return name
  }
}

export function randomString(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export function camelToSpacedPascal(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase())
}

export function capitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1)
}

export type Keys<T> = keyof T

export function isEven(num: number) {
  return num % 2 === 0
}
