import {
    PokemonBreederKind,
    PokemonEggGroup,
    PokemonGender,
    PokemonGenderSchema,
    PokemonIv,
    PokemonIvSchema,
    PokemonNature,
    PokemonNatureSchema,
    PokemonSpecies, PokemonSpeciesUnparsed,
} from "@/core/pokemon"
import { assert } from "@/lib/assert"
import React from "react"
import { useLocalStorage } from "@/lib/hooks"
import { z } from "zod"
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from "../consts"
import { PokemonBreedTarget } from "./PokemonBreedTarget"
import { PokemonIvSet } from "./PokemonIvSet"

export namespace PokemonBreedTree {
    export type PositionKey = string
    export class Position {
        constructor(
            public row: number,
            public col: number,
        ) {}

        public key(): PositionKey {
            return `${this.row},${this.col}`
        }

        static fromKey(key: PositionKey): Position {
            const [row, col] = key.split(",").map(Number)
            assert(row !== undefined, "Tried to make a key from invalid string")
            assert(col !== undefined, "Tried to make a key from invalid string")
            assert(!isNaN(row) && !isNaN(col), "Invalid BreedTreeNode key")

            return new Position(row, col)
        }
    }
    export type Map = Record<PositionKey, Node>
    export type MapSerialized = Record<PositionKey, NodeSerialized>

    export function useMap(props: {
        finalPokemonNode: Node
        finalPokemonIvSet: PokemonIvSet
        pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
        breedTreeMapInLocalStorage: MapSerialized | undefined
        init: boolean
        setInit: React.Dispatch<React.SetStateAction<boolean>>
    }) {
        const desired31IvCount = React.useMemo(
            () => Object.values(props.finalPokemonIvSet).filter(Boolean).length,
            [props.finalPokemonIvSet],
        )
        const [map, setMap] = React.useState<Map>({})

        function init(
            finalPokemonNode: Node,
            finalPokemonIvSet: PokemonIvSet,
            desired31Ivcount: number,
            breedTreeMapInLocalStorage?: MapSerialized,
        ) {
            const _map: Map = {}
            _map[finalPokemonNode.position.key()] = finalPokemonNode

            const natured = Boolean(finalPokemonNode.nature)

            assert(finalPokemonNode.ivs, "finalPokemonNode.ivs should exist")
            assert([2, 3, 4, 5].includes(desired31Ivcount), "Invalid generations number")

            const lastRowBreeders =
                POKEMON_BREEDTREE_LASTROW_MAPPING[desired31Ivcount as keyof typeof POKEMON_BREEDTREE_LASTROW_MAPPING]
            const lastRowBreedersPositions = natured ? lastRowBreeders.natured : lastRowBreeders.natureless

            // initialize last row
            for (const [k, v] of lastRowBreedersPositions.entries()) {
                switch (v) {
                    case PokemonBreederKind.Nature: {
                        const position = Position.fromKey(k)

                        _map[position.key()] = new Node({ nature: finalPokemonNode.nature, position })
                        break
                    }
                    default: {
                        const position = Position.fromKey(k)
                        const ivs = finalPokemonIvSet.get(v)
                        assert(ivs, "Ivs should exist for last row breeders")

                        _map[position.key()] = new Node({ position, ivs: [ivs] })
                        break
                    }
                }
            }

            // initialize the rest of the tree
            // start from the second to last row
            // stops on the first row where the final pokemon node is already set
            // -1 for natured because of the way POKEMON_BREEDTREE_LASTROW_MAPPING is defined
            let row = natured ? desired31Ivcount - 1 : desired31Ivcount - 2
            while (row > 0) {
                let col = 0
                while (col < Math.pow(2, row)) {
                    const position = new Position(row, col)
                    const node = new Node({ position })

                    const parentNodes = node.getParentNodes(_map)
                    assert(parentNodes, `Parent nodes should exist for node: ${node.position.key()}`)

                    const p1Node = parentNodes[0]
                    const p2Node = parentNodes[1]

                    // calculate ivs and nature from parent nodes
                    const ivs = [...new Set([...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])])]
                    const nature = p1Node.nature ?? p2Node.nature ?? undefined

                    node.setNature(nature).setIvs(ivs)
                    _map[position.key()] = node

                    col = col + 1
                }
                row = row - 1
            }

            if (breedTreeMapInLocalStorage) {
                deserialize(breedTreeMapInLocalStorage, _map)
            }

            setMap(_map)
        }

        function serialize(): MapSerialized {
            const exported: MapSerialized = {}
            for (const [key, node] of Object.entries(map)) {
                exported[key] = node.toSerialized()
            }
            return exported
        }

        function deserialize(serializedTreeMap: MapSerialized, breedTreeMapCopy: Map) {
            if (Object.keys(breedTreeMapCopy).length < 1) {
                return
            }

            for (const [pos, value] of Object.entries(serializedTreeMap)) {
                const node = breedTreeMapCopy[pos]
                assert(node, `Failed to import breed tree. Exported tree contains invalid position. (${pos})`)

                const unparsedSpecies = props.pokemonSpeciesUnparsed.find((p) => p.number === value.species)
                if (unparsedSpecies) {
                    const species = PokemonSpecies.parse(unparsedSpecies)
                    node.setSpecies(species)
                }

                node.setNickname(value.nickname).setGender(value.gender)
            }

            setMap(breedTreeMapCopy)
        }

        React.useEffect(() => {
            if (!props.finalPokemonNode.species) {
                return
            }

            if (!props.init) {
                return
            }

            init(props.finalPokemonNode, props.finalPokemonIvSet, desired31IvCount, props.breedTreeMapInLocalStorage)
            props.setInit(false)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.finalPokemonNode, props.finalPokemonIvSet, desired31IvCount, map, props.breedTreeMapInLocalStorage])

        return {
            map,
            setMap,
            serialize,
            deserialize,
        } as const
    }

    export type UseBreedTreeMap = ReturnType<typeof useMap>

    export const NodeSerialized = z.object({
        species: z.number().optional(),
        gender: PokemonGenderSchema.optional(),
        nickname: z.string().optional(),
        genderCostIgnored: z.boolean().optional(),
    })
    export type NodeSerialized = z.infer<typeof NodeSerialized>

    export class Node {
        position: PokemonBreedTree.Position
        species?: PokemonSpecies | undefined
        gender?: PokemonGender | undefined
        nature?: PokemonNature | undefined
        ivs?: PokemonIv[] | undefined
        nickname?: string | undefined
        genderCostIgnored?: boolean

        constructor(params: {
            position: PokemonBreedTree.Position
            species?: PokemonSpecies
            gender?: PokemonGender
            nature?: PokemonNature
            ivs?: PokemonIv[]
            nickname?: string
            genderCostIgnored?: boolean
        }) {
            this.position = params.position
            this.species = params.species
            this.gender = params.gender
            this.nature = params.nature
            this.ivs = params.ivs
            this.nickname = params.nickname
        }

        static EMPTY(pos: Position): Node {
            return new Node({ position: pos })
        }

        static ROOT(breedTarget: { species?: PokemonSpecies; nature?: PokemonNature; ivs: PokemonIvSet }): Node {
            return new Node({
                position: new Position(0, 0),
                species: breedTarget.species,
                ivs: Object.values(breedTarget.ivs).filter(Boolean),
                nature: breedTarget.nature,
            })
        }

        public toSerialized(): NodeSerialized {
            return {
                species: this.species?.number,
                gender: this.gender,
                nickname: this.nickname,
                genderCostIgnored: this.genderCostIgnored,
            }
        }

        public getChildNode(map: Map): Node | undefined {
            const childRow = this.position.row - 1
            const childCol = Math.floor(this.position.col / 2)
            const childPosition = new Position(childRow, childCol)

            return map[childPosition.key()]
        }

        public getPartnerNode(map: Map): Node | undefined {
            const partnerCol = (this.position.col & 1) === 0 ? this.position.col + 1 : this.position.col - 1
            const partnerPos = new Position(this.position.row, partnerCol)

            return map[partnerPos.key()]
        }

        public getParentNodes(map: Map): [Node, Node] | undefined {
            const parentRow = this.position.row + 1
            const parentCol = this.position.col * 2

            const parent1 = map[new Position(parentRow, parentCol).key()]
            const parent2 = map[new Position(parentRow, parentCol + 1).key()]

            if (!parent1 || !parent2) return undefined

            return [parent1, parent2]
        }

        public isRootNode(): boolean {
            return this.position.key() === "0,0"
        }

        public isDitto(): boolean {
            return this.species?.eggGroups[0] === PokemonEggGroup.Ditto
        }

        public isGenderless(): boolean {
            return this.species?.eggGroups[0] === PokemonEggGroup.Genderless
        }

        public setSpecies(species?: PokemonSpecies): Node {
            this.species = species
            return this
        }

        public setNature(nature?: PokemonNature): Node {
            this.nature = nature
            return this
        }

        public setIvs(ivs?: PokemonIv[]): Node {
            this.ivs = ivs
            return this
        }

        public setGender(gender?: PokemonGender): Node {
            this.gender = gender
            return this
        }

        public setNickname(nickname?: string): Node {
            this.nickname = nickname
            return this
        }

        public setGenderCostIgnored(ignored: boolean): Node {
            this.genderCostIgnored = ignored
            return this
        }
    }

    export const Serialized = z.object({
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
        breedTree: z.record(z.string(), NodeSerialized),
    })
    export type Serialized = z.infer<typeof Serialized>

    export interface Context {
        pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
        breedTarget: PokemonBreedTarget
        breedTree: UseBreedTreeMap
        serialize: () => PokemonBreedTree.Serialized
        deserialize: (serialized: PokemonBreedTree.Serialized) => void
        saveToLocalStorage: () => void
        loadFromLocalStorage: () => void
        resetLocalStorage: () => void
    }

    export const ContextPrimitive = React.createContext<Context | null>(null)

    export function Context(props: { pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]; children: React.ReactNode }) {
        const pokemonSpeciesUnparsed = React.useMemo(() => props.pokemonSpeciesUnparsed, [props.pokemonSpeciesUnparsed])
        const [localStorageTree, setLocalStorageTree] = useLocalStorage<PokemonBreedTree.Serialized | undefined>(
            "last-tree",
            undefined,
        )
        const [species, setSpecies] = React.useState<PokemonSpecies>()
        const [nature, setNature] = React.useState<PokemonNature>()
        const [ivs, setIvs] = React.useState<PokemonIvSet>(PokemonIvSet.DEFAULT)
        const [initMap, setInitMap] = React.useState(true)
        const breedTree = useMap({
            finalPokemonNode: Node.ROOT({
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

        function serialize(): PokemonBreedTree.Serialized {
            assert(species, "Attempted to serialize target Pokemon before initializing context.")
            const breedTargetSerialized = { ivs, nature }
            const breedTreeSerialized = breedTree.serialize()

            return {
                breedTarget: breedTargetSerialized,
                breedTree: breedTreeSerialized,
            }
        }

        function deserialize(serialized: PokemonBreedTree.Serialized) {
            const rootNode = serialized.breedTree["0,0"]
            assert(rootNode, "Deserialize failed. Root node not found.")

            const speciesUnparsed = props.pokemonSpeciesUnparsed.find((p) => p.number === rootNode.species)
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
            <ContextPrimitive.Provider
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
                    resetLocalStorage,
                }}
            >
                {props.children}
            </ContextPrimitive.Provider>
        )
    }

    export function useContext() {
        const ctx = React.useContext(ContextPrimitive)
        assert(ctx, "usePokemonToBreed must be used within a PokemonToBreedContextProvider")

        return ctx
    }
}
