'use client'

import React from 'react'
import { IPokemonToBreedContext, IVs } from './types'
import { Pokemon, NatureType } from '@/data/types'

export const PokemonToBreedContextPrimitive =
  React.createContext<IPokemonToBreedContext>({} as IPokemonToBreedContext)

export const PokemonToBreedContext = (props: { children: React.ReactNode }) => {
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null)
  const [nature, setNature] = React.useState<NatureType | null>(null)
  const [ivs, setIvs] = React.useState<IVs | null>(null)
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
