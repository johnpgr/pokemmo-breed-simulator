import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/PokemonBreedTree"
import { BreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import pokemons from "@/data/data.json" assert { type: "json" }

export default async function HomePage() {
    return (
        <BreedTreeContext pokemonSpeciesUnparsed={pokemons}>
            <PokemonToBreedSelect />
            <PokemonBreedTree />
        </BreedTreeContext>
    )
}
