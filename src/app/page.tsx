import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTreeView } from "@/components/PokemonBreedTreeView"
import { BreedContext } from "@/core/PokemonBreedContext"
import pokemons from "@/data/monster.json" assert { type: "json" }
import evolutions from "@/data/evolutions.json" assert { type: "json" }

export default async function HomePage() {
    return (
        <BreedContext species={pokemons} evolutions={evolutions}>
            <PokemonToBreedSelect />
            <PokemonBreedTreeView />
        </BreedContext>
    )
}
