import React, { type Dispatch, type SetStateAction } from "react"

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [state, _setState] = React.useState<T>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key)
      try {
        return stored ? (JSON.parse(stored) as T) : defaultValue
      } catch {
        console.warn("Failed to parse state from localStorage")
        return defaultValue
      }
    }
    return defaultValue
  })

  const setState: Dispatch<SetStateAction<T>> = (value) => {
    const newValue = value instanceof Function ? value(state) : value
    _setState(newValue)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch {
        console.warn("Failed to stringify state value for the localStorage")
      }
    }
  }

  return [state, setState]
}
