import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/PokemonBreedTree"
import { PokemonToBreedContext } from "@/components/PokemonToBreedContext"
import pokemons from "@/data/data.json" assert { type: "json" }

export default async function HomePage() {
    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect pokemons={pokemons} />
            <PokemonBreedTree pokemons={pokemons} />
        </PokemonToBreedContext>
    )
}
