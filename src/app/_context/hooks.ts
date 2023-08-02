import { useContext } from 'react'
import { PokemonToBreedContextPrimitive } from '.'
import { raise } from '@/lib/utils'

export function usePokemonToBreed() {
  const ctx = useContext(PokemonToBreedContextPrimitive)
  return (
    ctx ??
    raise(
      'usePokemonToBreed must be used within a PokemonToBreedContextProvider',
    )
  )
}
