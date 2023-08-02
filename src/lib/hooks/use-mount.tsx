'use client'
import { useEffect, useRef } from 'react'

export function useMount(fn: () => void) {
  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true
    fn()
  }, [])
}
