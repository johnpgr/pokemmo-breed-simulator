"use client"

import { getSpriteForPkmnNumber } from "sprites"
import { api } from "~/utils/api"

export const PokemonList = () => {
    const [data] = api.pokemon.all.useSuspenseQuery(undefined, {
        staleTime: Infinity,
    })
    return <ul>
        {data.map(pokemon => <li className="flex items-center gap-4" key={pokemon.pokedexNumber}>
            <img src={getSpriteForPkmnNumber(pokemon.pokedexNumber)}
                style={{ imageRendering: "pixelated" }}
            />
            <div>
                <h2 className="text-2xl font-bold">{pokemon.name}</h2>
                <p className="text-gray-500">#{pokemon.pokedexNumber}</p>
                <div className="flex gap-1">
                    <p>{pokemon.type1}</p>
                    <p>{pokemon.type2}</p>
                </div>
                <p>
                    {pokemon.eggType1} {pokemon.eggType2}
                </p>
            </div>
        </li>)}
    </ul>
}
