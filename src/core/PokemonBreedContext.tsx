"use client"
import React from "react"
import { PokemonIvSchema, PokemonNatureSchema, PokemonSpecies, PokemonSpeciesUnparsed } from "./pokemon"
import { PokemonNode, PokemonNodeSerialized, usePokemonBreedMap, UsePokemonBreedMap } from "./PokemonBreedMap"
import { assert } from "@/lib/assert"
import { useLocalStorage } from "@/lib/hooks"
import { PokemonIvSet } from "./PokemonIvSet"
import { z } from "zod"

export interface BreedContext {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    pokemonEvolutions: number[][]
    breedTarget: PokemonNode
    setBreedTarget: React.Dispatch<React.SetStateAction<PokemonNode>>
    breedTree: UsePokemonBreedMap
    serialize: () => BreedContextSerialized
    deserialize: (serialized: BreedContextSerialized) => void
    localStorageTree: BreedContextSerialized | undefined,
    setLocalStorageTree: React.Dispatch<React.SetStateAction<BreedContextSerialized | undefined>>
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
    const [breedTarget, setBreedTarget] = React.useState(PokemonNode.ROOT({ ivs: PokemonIvSet.DEFAULT }))
    const breedTree = usePokemonBreedMap({
        finalPokemonNode: breedTarget,
        storedBreedTree: localStorageTree?.breedTree,
        pokemonSpeciesUnparsed: props.pokemonSpeciesUnparsed,
    })

    function serialize(): BreedContextSerialized {
        assert(
            breedTarget.species !== undefined,
            "Attempted to serialize target Pokemon before initializing context.",
        )
        assert(breedTarget.ivs !== undefined, "Attempted to serialize target Pokemon before initializing context.")
        const breedTargetSerialized = {
            ivs: PokemonIvSet.fromArray(breedTarget.ivs),
            nature: breedTarget.nature,
        }
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

        setBreedTarget((prev) => {
            const copy = prev.clone()
            copy.species = species
            copy.ivs = ivs.toArray()
            copy.nature = serialized.breedTarget.nature
            return copy
        })
    }

    function saveToLocalStorage() {
        setLocalStorageTree(serialize())
    }

    function loadFromLocalStorage() {
        if (localStorageTree?.breedTree["0,0"]) {
            deserialize(localStorageTree)
            breedTree.deserialize(localStorageTree.breedTree, breedTree.map, props.pokemonSpeciesUnparsed)
            breedTree.setMap({...breedTree.map})
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
                breedTarget,
                setBreedTarget,
                serialize,
                deserialize,
                localStorageTree,
                setLocalStorageTree,
                saveToLocalStorage,
                loadFromLocalStorage,
                resetLocalStorage,
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
