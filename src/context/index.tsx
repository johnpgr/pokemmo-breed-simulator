"use client"

import { NatureType, Pokemon } from "@/data/types"
import React from "react"
import { IPokemonToBreedContext, IVMap } from "./types"

export const PokemonToBreedContextPrimitive =
  React.createContext<IPokemonToBreedContext>({} as IPokemonToBreedContext)

export function PokemonToBreedContext(props: { children: React.ReactNode }) {
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null)
  const [nature, setNature] = React.useState<NatureType | null>(null)
  const [ivMap, setIvMap] = React.useState<IVMap>({
    a: "hp",
    b: "attack",
    c: null,
    d: null,
    e: null,
  })

  return (
    <PokemonToBreedContextPrimitive.Provider
      value={{
        pokemon,
        setPokemon,
        nature,
        setNature,
        ivMap,
        setIvMap,
      }}
    >
      {props.children}
    </PokemonToBreedContextPrimitive.Provider>
  )
}
