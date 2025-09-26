import z from "zod"
import { ZPokemonNode, type PokemonNode } from "./node"
import type { PokemonBreederKind } from "./pokemon"
import type { PokemonBreedMapPositionKey } from "./position"
import type { BreedError } from "./breeder"

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

export type BreedErrors = Record<PokemonBreedMapPositionKey, BreedError[]>