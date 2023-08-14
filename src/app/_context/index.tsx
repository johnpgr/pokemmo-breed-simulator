'use client'

import { NatureType, Pokemon } from '@/data/types'
import React from 'react'
import { IPokemonToBreedContext, IV } from './types'

export const PokemonToBreedContextPrimitive =
  React.createContext<IPokemonToBreedContext>({} as IPokemonToBreedContext)

export const PokemonToBreedContext = (props: { children: React.ReactNode }) => {
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null)
  const [nature, setNature] = React.useState<NatureType | null>(null)
  const [ivs, setIvs] = React.useState<IV[] | null>(null)

  return (
    <PokemonToBreedContextPrimitive.Provider
      value={{
        pokemon,
        setPokemon,
        nature,
        setNature,
        ivs,
        setIvs,
      }}
    >
      {props.children}
    </PokemonToBreedContextPrimitive.Provider>
  )
}
