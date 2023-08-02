import PokemonTree from './_breeding/tree'
import pokemons from '@/data/data.json'

export const runtime = 'edge'

export default async function HomePage() {
  const _pokemons = pokemons.map((pokemon) => ({
    name: pokemon.name,
    number: pokemon.pokedexNumber,
  }))
  return <PokemonTree pokemons={_pokemons} numberOf31IVs={5} natured={true} />
}
