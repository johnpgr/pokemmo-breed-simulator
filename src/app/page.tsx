import pokemons from "@/data/data.json"
import { PokemonToBreedContext } from "./_context"
import { PokemonToBreedTree } from "./_breeding/tree"
import { PokemonToBreedSelector } from "./_breeding/poke-to-breed-form"

export const runtime = "edge"

export default async function HomePage() {
  const _pokemons = pokemons.map((pokemon) => ({
    name: pokemon.name,
    number: pokemon.pokedexNumber,
  }))
  return (
    <PokemonToBreedContext>
      <PokemonToBreedSelector pokemons={_pokemons} />
      <PokemonToBreedTree pokemons={_pokemons} />
    </PokemonToBreedContext>
  )
}
