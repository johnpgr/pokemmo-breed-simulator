import { getPokemonByName } from "@/actions/pokemon-by-name"
import { PokemonToBreedSelector } from "@/breeding/form"
import { PokemonToBreedTree } from "@/breeding/pokemon-tree"
import pokemons from "@/data/data.json"
import { IEggType, PokemonSelectList } from "@/data/types"
import { PokemonToBreedContext } from "../context"

export const runtime = "edge"

export default async function HomePage() {
  const _pokemons = pokemons.map((pokemon) => ({
    name: pokemon.name,
    number: pokemon.pokedexNumber,
    eggTypes: pokemon.eggTypes as Array<IEggType>,
  })) satisfies PokemonSelectList

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
