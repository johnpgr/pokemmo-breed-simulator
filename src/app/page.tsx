import pokemons from '@/data/data.json'
import { RenderTree } from './_breeding/render-tree'
import { PokemonToBreedSelector } from './_components/pokemon-to-breed'
import { PokemonToBreedContext } from './_context'

export const runtime = 'edge'

export default async function HomePage() {
  const _pokemons = pokemons.map((pokemon) => ({
    name: pokemon.name,
    number: pokemon.pokedexNumber,
  }))
  return (
    <PokemonToBreedContext>
      <PokemonToBreedSelector pokemons={_pokemons} />
      <RenderTree pokemons={_pokemons} />
    </PokemonToBreedContext>
  )
}
