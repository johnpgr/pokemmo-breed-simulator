"use server"
import type { Pokemon } from "@/data/types"

export async function getPokemonByName(name: string): Promise<Pokemon | null> {
    const pokemons = (
        await import("@/data/data.json", {
            assert: {
                type: "json",
            },
        })
    ).default

    const pokemon = pokemons.find((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase())

    return (pokemon as Pokemon) ?? null
}
