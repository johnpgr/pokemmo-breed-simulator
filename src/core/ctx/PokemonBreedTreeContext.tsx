"use client"
import { PokemonBreederKind, PokemonIv, PokemonNature, PokemonSpecies, PokemonSpeciesUnparsed } from "@/core/pokemon"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { UseBreedTreeMap, useBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import { PokemonBreedTreeSerialized } from "@/persistence/schema"
import React from "react"

export type BreedTargetSerialized = {
    ivs: IVSet
    nature?: PokemonNature
}

export type BreedTarget = {
    species: PokemonSpecies | undefined
    setSpecies: React.Dispatch<React.SetStateAction<PokemonSpecies | undefined>>
    ivs: IVSet
    setIvs: React.Dispatch<React.SetStateAction<IVSet>>
    nature: PokemonNature | undefined
    setNature: React.Dispatch<React.SetStateAction<PokemonNature | undefined>>
}

export interface BreedTreeContext {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    breedTarget: BreedTarget
    breedTree: UseBreedTreeMap
    serialize: () => PokemonBreedTreeSerialized
    deserialize: (serialized: PokemonBreedTreeSerialized) => void
    saveToLocalStorage: () => void
    loadFromLocalStorage: () => void
}

export const BreedTreeContextPrimitive = React.createContext<BreedTreeContext | null>(null)

export function BreedTreeContext(props: {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    children: React.ReactNode
}) {
    const pokemonSpeciesUnparsed = React.useMemo(() => props.pokemonSpeciesUnparsed, [props.pokemonSpeciesUnparsed])
    const [localStorageTree, setLocalStorageTree] = useLocalStorage<PokemonBreedTreeSerialized | undefined>(
        "last-tree",
        undefined,
    )
    const [species, setSpecies] = React.useState<PokemonSpecies>()
    const [nature, setNature] = React.useState<PokemonNature>()
    const [ivs, setIvs] = React.useState<IVSet>(IVSet.DEFAULT)
    const [initMap, setInitMap] = React.useState(true)
    const breedTree = useBreedTreeMap({
        finalPokemonNode: PokemonBreedTreeNode.ROOT({
            ivs: ivs,
            nature: nature,
            species: species,
        }),
        finalPokemonIvSet: ivs,
        pokemonSpeciesUnparsed: props.pokemonSpeciesUnparsed,
        breedTreeMapInLocalStorage: localStorageTree?.breedTree,
        init: initMap,
        setInit: setInitMap,
    })

    function serialize(): PokemonBreedTreeSerialized {
        assert.exists(species, "Attempted to serialize target Pokemon before initializing context.")
        const breedTargetSerialized = { ivs, nature } satisfies BreedTargetSerialized
        const breedTreeSerialized = breedTree.serialize()

        return {
            breedTarget: breedTargetSerialized,
            breedTree: breedTreeSerialized,
        }
    }

    function deserialize(serialized: PokemonBreedTreeSerialized) {
        console.log("Deserializing", serialized)
        const rootNode = serialized.breedTree["0,0"]
        assert.exists(rootNode, "Deserialize failed. Root node not found.")

        const speciesUnparsed = props.pokemonSpeciesUnparsed.find((p) => p.number === rootNode.species)
        assert.exists(speciesUnparsed, "Failed to import Pokemon to breed target species. Invalid Pokemon number")

        const species = PokemonSpecies.parse(speciesUnparsed)
        const ivs = new IVSet(
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

    return (
        <BreedTreeContextPrimitive.Provider
            value={{
                pokemonSpeciesUnparsed,
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
            }}
        >
            {props.children}
        </BreedTreeContextPrimitive.Provider>
    )
}

export function useBreedTreeContext() {
    const ctx = React.useContext(BreedTreeContextPrimitive)
    assert.exists(ctx, "usePokemonToBreed must be used within a PokemonToBreedContextProvider")

    return ctx
}

export class IVSet {
    constructor(
        public A: PokemonIv,
        public B: PokemonIv,
        public C?: PokemonIv,
        public D?: PokemonIv,
        public E?: PokemonIv,
    ) { }

    public get(kind: PokemonBreederKind): PokemonIv | undefined {
        switch (kind) {
            case PokemonBreederKind.A:
                return this.A
            case PokemonBreederKind.B:
                return this.B
            case PokemonBreederKind.C:
                return this.C
            case PokemonBreederKind.D:
                return this.D
            case PokemonBreederKind.E:
                return this.E
            default:
                return undefined
        }
    }

    static DEFAULT = new IVSet(PokemonIv.HP, PokemonIv.Attack)
}
