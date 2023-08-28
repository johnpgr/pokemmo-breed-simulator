import pokemons from "@/data/data.json"
import { PokemonToBreedContext } from "../context"
import { PokemonToBreedSelector } from "@/breeding/form"
import { PokemonToBreedTree } from "@/breeding/tree"
import { getPokemonByName } from "@/actions/pokemon-by-name"

export const runtime = "edge"

export default async function HomePage() {
  const _pokemons = pokemons.map((pokemon) => ({
    name: pokemon.name,
    number: pokemon.pokedexNumber,
  }))
  return (
    <PokemonToBreedContext>
      <PokemonToBreedSelector
        getPokemonByName={getPokemonByName}
        pokemons={_pokemons}
      />
      <PokemonToBreedTree
        getPokemonByName={getPokemonByName}
        pokemons={_pokemons}
      />
    </PokemonToBreedContext>
  )
}
