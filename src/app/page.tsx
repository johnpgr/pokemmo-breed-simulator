import pokemons from "@/data/data.json"
import { PokemonToBreedContext } from "../context"
import { PokemonToBreedSelector } from "@/breeding/form"
import { PokemonToBreedTree } from "@/breeding/tree"
import { getPokemonByName } from "@/actions/pokemon-by-name"
import { EggType, PokemonSelectList } from "@/data/types"

export const runtime = "edge"

export default async function HomePage() {
  const _pokemons = pokemons.map((pokemon) => ({
    name: pokemon.name,
    number: pokemon.pokedexNumber,
    eggTypes: pokemon.eggTypes as Array<EggType>,
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
