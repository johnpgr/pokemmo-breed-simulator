"use client"
import { assert } from "@/lib/assert"
import { useLocalStorage } from "@/lib/hooks"
import React from "react"
import { PokemonBreedMapSerialized, UsePokemonBreedMap, ZBreedMap, usePokemonBreedMap } from "./PokemonBreedMap"
import { PokemonSpecies, PokemonSpeciesRaw } from "./pokemon"

export interface BreedContext {
    species: PokemonSpeciesRaw[]
    evolutions: number[][]
    breedTree: UsePokemonBreedMap
    savedTree: ZBreedMap | undefined
    serialize(): PokemonBreedMapSerialized
    deserialize(deserialized: PokemonBreedMapSerialized): void
    save: () => void
    load: () => void
    reset: () => void
}

export const BreedContextPrimitive = React.createContext<BreedContext | null>(null)

export function BreedContext(props: {
    species: PokemonSpeciesRaw[]
    evolutions: number[][]
    children: React.ReactNode
}) {
    const [savedTree, setSavedTree] = useLocalStorage<ZBreedMap | undefined>("last-tree", undefined)
    const breedTree = usePokemonBreedMap()

    function serialize(): PokemonBreedMapSerialized {
        const target = breedTree.rootNode()
        assert(target.species !== undefined, "Attempted to serialize target Pokemon before initializing context.")
        assert(target.ivs !== undefined, "Attempted to serialize target Pokemon before initializing context.")
        const serialized: PokemonBreedMapSerialized = {}
        for (const [key, node] of Object.entries(breedTree.map)) {
            serialized[key] = node.serialize()
        }

        return serialized
    }

    function deserialize(serialized: PokemonBreedMapSerialized) {
        for (const [pos, nodeRaw] of Object.entries(serialized)) {
            const pokeSpecies = props.species.find((p) => p.id === nodeRaw.id)
            assert(pokeSpecies !== undefined, "Failed to import Pokemon to breed target species. Invalid Pokemon id")
            const species = PokemonSpecies.parse(pokeSpecies)

            const node = breedTree.map[pos]
            assert(node !== undefined, "Deserialize failed, invalid tree position")

            if (pos === "0,0") {
                assert(nodeRaw.ivs !== undefined, "Deserialize failed. Root node w/ no Ivs")
                node.ivs = nodeRaw.ivs
            }

            node.species = species
            node.gender = nodeRaw.gender
            node.nickname = nodeRaw.nickname
            node.nature = nodeRaw.nature
        }

        breedTree.setMap({ ...breedTree.map })
    }

    function save() {
        setSavedTree(serialize())
    }

    function load() {
        if (savedTree?.["0,0"]) {
            deserialize(savedTree)
        }
    }

    function reset() {
        setSavedTree(undefined)
    }

    return (
        <BreedContextPrimitive.Provider
            value={{
                species: props.species,
                evolutions: props.evolutions,
                breedTree,
                savedTree,
                serialize,
                deserialize,
                save,
                load,
                reset,
            }}
        >
            {props.children}
        </BreedContextPrimitive.Provider>
    )
}

//TODO: Migrate to React 19 use(Context)
export function useBreedContext() {
    const ctx = React.useContext(BreedContextPrimitive)
    assert(ctx, "usePokemonToBreed must be used within a PokemonToBreedContextProvider")

    return ctx
}
