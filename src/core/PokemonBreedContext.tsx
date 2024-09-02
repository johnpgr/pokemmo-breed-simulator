"use client"
import React from "react"
import { PokemonIvSchema, PokemonNature, PokemonNatureSchema, PokemonSpecies, PokemonSpeciesUnparsed } from "./pokemon"
import { PokemonNode, PokemonNodeSerialized, usePokemonBreedMap, UsePokemonBreedMap } from "./PokemonBreedMap"
import { assert } from "@/lib/assert"
import { useLocalStorage } from "@/lib/hooks"
import { PokemonIvSet } from "./PokemonIvSet"
import { z } from "zod"

export interface BreedContext {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    pokemonEvolutions: number[][]
    breedTarget: BreedContextTarget
    breedTree: UsePokemonBreedMap
    serialize: () => BreedContextSerialized
    deserialize: (serialized: BreedContextSerialized) => void
    saveToLocalStorage: () => void
    loadFromLocalStorage: () => void
    resetLocalStorage: () => void
}

export const BreedContextPrimitive = React.createContext<BreedContext | null>(null)

export function BreedContext(props: {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    pokemonEvolutions: number[][]
    children: React.ReactNode
}) {
    const [localStorageTree, setLocalStorageTree] = useLocalStorage<BreedContextSerialized | undefined>(
        "last-tree",
        undefined,
    )
    const [species, setSpecies] = React.useState<PokemonSpecies>()
    const [nature, setNature] = React.useState<PokemonNature>()
    const [ivs, setIvs] = React.useState<PokemonIvSet>(PokemonIvSet.DEFAULT)
    const [initMap, setInitMap] = React.useState(true)
    const breedTree = usePokemonBreedMap({
        finalPokemonNode: PokemonNode.ROOT({
            ivs: ivs,
            nature: nature,
            species: species,
        }),
        finalPokemonIvSet: ivs,
        storedBreedTree: localStorageTree?.breedTree,
        init: initMap,
        setInit: setInitMap,
        pokemonSpeciesUnparsed: props.pokemonSpeciesUnparsed,
    })

    function serialize(): BreedContextSerialized {
        assert(species, "Attempted to serialize target Pokemon before initializing context.")
        const breedTargetSerialized = { ivs, nature }
        const breedTreeSerialized = breedTree.serialize()

        return {
            breedTarget: breedTargetSerialized,
            breedTree: breedTreeSerialized,
        }
    }

    function deserialize(serialized: BreedContextSerialized) {
        const rootNode = serialized.breedTree["0,0"]
        assert(rootNode, "Deserialize failed. Root node not found.")

        const speciesUnparsed = props.pokemonSpeciesUnparsed.find((p) => p.id === rootNode.id)
        assert(speciesUnparsed, "Failed to import Pokemon to breed target species. Invalid Pokemon number")

        const species = PokemonSpecies.parse(speciesUnparsed)
        const ivs = new PokemonIvSet(
            serialized.breedTarget.ivs.A,
            serialized.breedTarget.ivs.B,
            serialized.breedTarget.ivs.C,
            serialized.breedTarget.ivs.D,
            serialized.breedTarget.ivs.E,
        )

        setIvs(ivs)
        setSpecies(species)
        setNature(serialized.breedTarget.nature)
        setLocalStorageTree(serialized)
        setInitMap(true)
    }

    function saveToLocalStorage() {
        setLocalStorageTree(serialize())
    }

    function loadFromLocalStorage() {
        if (localStorageTree) {
            deserialize(localStorageTree)
        }
    }

    function resetLocalStorage() {
        setLocalStorageTree(undefined)
    }

    return (
        <BreedContextPrimitive.Provider
            value={{
                pokemonSpeciesUnparsed: props.pokemonSpeciesUnparsed,
                pokemonEvolutions: props.pokemonEvolutions,
                breedTree,
                breedTarget: {
                    species,
                    setSpecies,
                    nature,
                    setNature,
                    ivs,
                    setIvs,
                },
                serialize,
                deserialize,
                saveToLocalStorage,
                loadFromLocalStorage,
                resetLocalStorage,
            }}
        >
            {props.children}
        </BreedContextPrimitive.Provider>
    )
}

export function useBreedContext() {
    const ctx = React.useContext(BreedContextPrimitive)
    assert(ctx, "usePokemonToBreed must be used within a PokemonToBreedContextProvider")

    return ctx
}

export const BreedContextSerialized = z.object({
    breedTarget: z.object({
        ivs: z.object({
            A: PokemonIvSchema,
            B: PokemonIvSchema,
            C: PokemonIvSchema.optional(),
            D: PokemonIvSchema.optional(),
            E: PokemonIvSchema.optional(),
        }),
        nature: PokemonNatureSchema.optional(),
    }),
    breedTree: z.record(z.string(), PokemonNodeSerialized),
})
export type BreedContextSerialized = z.infer<typeof BreedContextSerialized>

export interface BreedContextTarget {
    species: PokemonSpecies | undefined
    setSpecies: React.Dispatch<React.SetStateAction<PokemonSpecies | undefined>>
    ivs: PokemonIvSet
    setIvs: React.Dispatch<React.SetStateAction<PokemonIvSet>>
    nature: PokemonNature | undefined
    setNature: React.Dispatch<React.SetStateAction<PokemonNature | undefined>>
}

export interface BreedContextTargetSerialized {
    ivs: PokemonIvSet
    nature?: PokemonNature
}
