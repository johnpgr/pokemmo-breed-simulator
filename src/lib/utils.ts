import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BASE_SPRITES_URL } from './consts'
import { Pokemon } from '@/data/types'

export function cn(...inputs: ClassValue[]) {
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
    case 'Nidoran-f':
      return 'Nidoran ♀'
    case 'Nidoran-m':
      return 'Nidoran ♂'
    default:
      return name
  }
}

export async function getPokemonByName(name: string) {
  const res = await fetch(`http://localhost:3000/api/pokemons/${name}`)
  return res.json() as Promise<Pokemon>
}
