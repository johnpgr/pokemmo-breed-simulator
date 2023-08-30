import { NatureType, Pokemon } from "@/data/types"
import { Dispatch, SetStateAction } from "react"

export const IVs = {
  hp: "hp",
  attack: "attack",
  defense: "defense",
  specialAttack: "specialAttack",
  specialDefense: "specialDefense",
  speed: "speed",
} as const

export type IV = keyof typeof IVs

export type IVMap = {
  a: IV
  b: IV
  c: IV | null
  d: IV | null
  e: IV | null
}

export type IPokemonToBreedContext = {
  pokemon: Pokemon | null
  ivMap: IVMap
  nature: NatureType | null
  setPokemon: Dispatch<SetStateAction<Pokemon | null>>
  setIvMap: Dispatch<SetStateAction<IVMap>>
  setNature: Dispatch<SetStateAction<NatureType | null>>
}
