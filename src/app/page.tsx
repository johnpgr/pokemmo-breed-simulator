import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTreeView } from "@/components/PokemonBreedTreeView"
import { BreedContextProvider } from "@/core/PokemonBreedContext"
import pokemons from "@/data/monster.json" assert { type: "json" }
import evolutions from "@/data/evolutions.json" assert { type: "json" }

export default function HomePage() {
    return (
        <BreedContextProvider species={pokemons} evolutions={evolutions}>
            <PokemonToBreedSelect />
            <PokemonBreedTreeView />
        </BreedContextProvider>
    )
}
