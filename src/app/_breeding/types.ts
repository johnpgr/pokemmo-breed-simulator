import { NatureType, Pokemon } from '@/data/types'
import { IVs } from '../_context/types'

export const columnsPerRow = [1, 2, 4, 8, 16, 32] as const
//undefined here is only for the selected pokemon to breed, where the gender doesn't matter
export type Gender = 'Male' | 'Female' | null 

export type BreedNode = {
  pokemon: Pokemon
  gender: Gender
  nature: NatureType | null
  ivs: IVs
  sibling: Position | null
  children: Position | null
  parent: Position | null
} | null

export type BreedMap = Record<Position, BreedNode>

export type Position = Row0 | Row1 | Row2 | Row3 | Row4 | Row5

export type Row0 = '0,0'
export type Row1 = '1,0' | '1,1'
export type Row2 = '2,0' | '2,1' | '2,2' | '2,3'
export type Row3 = '3,0' | '3,1' | '3,2' | '3,3' | '3,4' | '3,5' | '3,6' | '3,7'
export type Row4 =
  | '4,0'
  | '4,1'
  | '4,2'
  | '4,3'
  | '4,4'
  | '4,5'
  | '4,6'
  | '4,7'
  | '4,8'
  | '4,9'
  | '4,10'
  | '4,11'
  | '4,12'
  | '4,13'
  | '4,14'
  | '4,15'
export type Row5 =
  | '5,0'
  | '5,1'
  | '5,2'
  | '5,3'
  | '5,4'
  | '5,5'
  | '5,6'
  | '5,7'
  | '5,8'
  | '5,9'
  | '5,10'
  | '5,11'
  | '5,12'
  | '5,13'
  | '5,14'
  | '5,15'
  | '5,16'
  | '5,17'
  | '5,18'
  | '5,19'
  | '5,20'
  | '5,21'
  | '5,22'
  | '5,23'
  | '5,24'
  | '5,25'
  | '5,26'
  | '5,27'
  | '5,28'
  | '5,29'
  | '5,30'
  | '5,31'
