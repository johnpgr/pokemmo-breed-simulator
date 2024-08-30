import React from "react"
import type { PokemonNature, PokemonSpecies } from "./pokemon"
import type { PokemonIvSet } from "./PokemonIvSet"

export namespace PokemonBreedTarget {
    export type Serialized = {
        ivs: PokemonIvSet
        nature?: PokemonNature
    }
}

export interface PokemonBreedTarget {
    species: PokemonSpecies | undefined
    setSpecies: React.Dispatch<React.SetStateAction<PokemonSpecies | undefined>>
    ivs: PokemonIvSet
    setIvs: React.Dispatch<React.SetStateAction<PokemonIvSet>>
    nature: PokemonNature | undefined
    setNature: React.Dispatch<React.SetStateAction<PokemonNature | undefined>>
}
