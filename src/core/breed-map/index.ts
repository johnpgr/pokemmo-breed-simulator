import z from "zod"
import { PokemonBreederKind } from "../pokemon"
import { ZPokemonNode, type PokemonNode } from "./node"
import { type PokemonBreedMapPositionKey } from "./position"

export type PokemonBreedMap = Record<PokemonBreedMapPositionKey, PokemonNode>
export type PokemonBreedMapSerialized = Record<
  PokemonBreedMapPositionKey,
  ZPokemonNode
>

export type PokemonBreedTreeRowMapped = Record<
  PokemonBreedMapPositionKey,
  PokemonBreederKind
>

export const ZBreedMap = z.record(z.string(), ZPokemonNode)
export type ZBreedMap = z.infer<typeof ZBreedMap>
