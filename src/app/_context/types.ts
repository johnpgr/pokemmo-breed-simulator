import { NatureType, Pokemon } from '@/data/types'
import { Dispatch, SetStateAction } from 'react'

export type IV = 31 | null 
export type IVs = {
  hp: IV
  attack: IV
  defense: IV
  specialAttack: IV
  specialDefense: IV
  speed: IV
}

export type IPokemonToBreedContext = {
  pokemon: Pokemon | null
  ivs: IVs | null
  nature: NatureType | null
  setPokemon: Dispatch<SetStateAction<Pokemon | null>>
  setIvs: Dispatch<SetStateAction<IVs>>
  setNature: Dispatch<SetStateAction<NatureType | null>>
}
