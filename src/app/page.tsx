import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/PokemonBreedTree"
import { PokemonToBreedContext } from "@/components/PokemonToBreedContext"
import { PokemonSpeciesUnparsed } from "@/core/pokemon"
import { getBaseUrl } from "@/lib/url"

export default async function HomePage() {
    //TODO: Check if this shait is really getting cached
    const pokemons = await fetch(`${getBaseUrl()}/data.json`, { cache: "force-cache" }).then(
        (res) => res.json() as Promise<PokemonSpeciesUnparsed[]>,
    )

    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect pokemons={pokemons} />
            <PokemonBreedTree pokemons={pokemons} />
        </PokemonToBreedContext>
    )
}
