'use client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BASE_SPRITES_URL } from './consts'
import { useEffect, useRef } from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSprite(name: string) {
  return `${BASE_SPRITES_URL}/${name.toLowerCase()}.png`
}

export function useMount(fn: () => void) {
  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true
    fn()
  }, [])
}
