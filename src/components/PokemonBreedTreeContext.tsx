"use client"
import React from "react"
import {
    PokemonBreederKind,
    PokemonIv,
    PokemonNature,
    PokemonSpecies,
    PokemonSpeciesUnparsed,
} from "@/core/pokemon"
import { assert } from "@/lib/assert"
import { ExportedBreedTree } from "@/core/tree/useBreedTreeMap"
import { ExportedJsonObj } from "./PokemonBreedTree"

export type ExportedTargetPokemon = {
    ivs: IVSet
    nature?: PokemonNature
}

export interface BreedTreeContext {
    species: PokemonSpecies | undefined
    setSpecies: React.Dispatch<React.SetStateAction<PokemonSpecies | undefined>>
    ivs: IVSet
    setIvs: React.Dispatch<React.SetStateAction<IVSet>>
    nature: PokemonNature | undefined
    setNature: React.Dispatch<React.SetStateAction<PokemonNature | undefined>>
    importedTree: ExportedBreedTree | undefined
    setImportedTree: React.Dispatch<
        React.SetStateAction<ExportedBreedTree | undefined>
    >
    exportTargetPokemon: () => ExportedTargetPokemon
    importTargetPokemon: (args: ExportedJsonObj) => void
}

export const BreedTreeContextPrimitive =
    React.createContext<BreedTreeContext | null>(null)

export function BreedTreeContext(props: {
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    children: React.ReactNode
}) {
    const [importedTree, setImportedTree] = React.useState<
        ExportedBreedTree | undefined
    >(undefined)
    const [species, setSpecies] = React.useState<PokemonSpecies>()
    const [nature, setNature] = React.useState<PokemonNature>()
    const [ivs, setIvs] = React.useState<IVSet>(IVSet.DEFAULT)

    function exportTargetPokemon(): ExportedTargetPokemon {
        assert.exists(
            species,
            "Attempted to export a targetPokemon before initializing context.",
        )
        return { ivs, nature }
    }

    function importTargetPokemon(args: ExportedJsonObj) {
        const rootNode = args.breedTree["0,0"]
        assert.exists(rootNode, "Failed to import. rootNode not found.")

        const speciesUnparsed = props.pokemonSpeciesUnparsed.find(
            (p) => p.number === rootNode.species,
        )
        assert.exists(
            speciesUnparsed,
            "Failed to import Pokemon to breed target species. Invalid Pokemon number",
        )
        const species = PokemonSpecies.parse(speciesUnparsed)
        const ivs = new IVSet(
            args.breedTarget.ivs.A,
            args.breedTarget.ivs.B,
            args.breedTarget.ivs.C,
            args.breedTarget.ivs.D,
            args.breedTarget.ivs.E,
        )

        setIvs(ivs)
        setSpecies(species)
        setNature(args.breedTarget.nature)
        setImportedTree(args.breedTree)
    }

    return (
        <BreedTreeContextPrimitive.Provider
            value={{
                species,
                setSpecies,
                nature,
                setNature,
                ivs,
                setIvs,
                importedTree,
                setImportedTree,
                exportTargetPokemon,
                importTargetPokemon,
            }}
        >
            {props.children}
        </BreedTreeContextPrimitive.Provider>
    )
}

export function useBreedTreeContext() {
    const ctx = React.useContext(BreedTreeContextPrimitive)
    assert.exists(
        ctx,
        "usePokemonToBreed must be used within a PokemonToBreedContextProvider",
    )

    return ctx
}

export class IVSet {
    constructor(
        public A: PokemonIv,
        public B: PokemonIv,
        public C?: PokemonIv,
        public D?: PokemonIv,
        public E?: PokemonIv,
    ) {}

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
