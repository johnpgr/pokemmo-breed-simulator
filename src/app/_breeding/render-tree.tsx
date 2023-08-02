'use client'

import { usePokemonToBreed } from '../_context/hooks'
import PokemonTree from './tree'

export const RenderTree = (props: {
  pokemons: { name: string; number: number }[]
}) => {
  const ctx = usePokemonToBreed()
  if (!ctx.pokemon || !ctx.ivs) {
    return null
  }
  return <PokemonTree pokemons={props.pokemons} />
}
