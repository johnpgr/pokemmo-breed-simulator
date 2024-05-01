import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/PokemonBreedTree"
import { PokemonToBreedContext } from "@/components/PokemonToBreedContext"
import { PokemonSpeciesUnparsed } from "@/core/pokemon"

export default async function HomePage() {
    //TODO: Check if this shait is really getting cached
    const pokemons = await fetch("http://localhost:3000/data.json", { cache: "force-cache" }).then(
        (res) => res.json() as Promise<PokemonSpeciesUnparsed[]>,
    )

    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect pokemons={pokemons} />
            <PokemonBreedTree pokemons={pokemons} />
        </PokemonToBreedContext>
    )
}
