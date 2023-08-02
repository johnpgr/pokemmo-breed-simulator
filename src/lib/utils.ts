import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BASE_SPRITES_URL } from './consts'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSprite(name: string) {
  return `${BASE_SPRITES_URL}/${name.toLowerCase()}.png`
}
