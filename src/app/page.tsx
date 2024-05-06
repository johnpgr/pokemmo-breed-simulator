import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/PokemonBreedTree"
import { BreedTreeContext } from "@/components/PokemonBreedTreeContext"
import pokemons from "@/data/data.json" assert { type: "json" }

export default async function HomePage() {
    return (
        <BreedTreeContext pokemonSpeciesUnparsed={pokemons}>
            <PokemonToBreedSelect pokemonSpeciesUnparsed={pokemons} />
            <PokemonBreedTree pokemonSpeciesUnparsed={pokemons} />
        </BreedTreeContext>
    )
}
