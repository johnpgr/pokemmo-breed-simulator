import { NatureType, Pokemon } from "@/data/types"
import { IVs } from "../_context/types"

export const columnsPerRow = [1, 2, 4, 8, 16, 32] as const
export type Position = [number, number]
//undefined here is only for the selected pokemon to breed, where the gender doesn't matter
export type Gender = 'Male' | 'Female' | undefined

export type Breed = {
  pokemon: Pokemon
  gender: Gender
  nature: NatureType | null
  ivs: IVs
}

export type Generations = 1 | 2 | 3 | 4 | 5 | 6
