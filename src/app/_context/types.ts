import { NatureType, Pokemon } from '@/data/types'
import { Dispatch, SetStateAction } from 'react'

export const IVs = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  specialAttack: 'specialAttack',
  specialDefense: 'specialDefense',
  speed: 'speed',
} as const

export type IV = keyof typeof IVs

export type IPokemonToBreedContext = {
  pokemon: Pokemon | null
  ivs: IV[] | null
  nature: NatureType | null
  setPokemon: Dispatch<SetStateAction<Pokemon | null>>
  setIvs: Dispatch<SetStateAction<IV[] | null>>
  setNature: Dispatch<SetStateAction<NatureType | null>>
}
