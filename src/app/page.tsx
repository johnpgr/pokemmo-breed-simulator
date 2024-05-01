import { PokemonToBreedSelect } from "@/components/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/PokemonBreedTree"
import { PokemonToBreedContext } from "@/components/PokemonToBreedContext"

export default function HomePage() {
    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect />
            <PokemonBreedTree />
        </PokemonToBreedContext>
    )
}
