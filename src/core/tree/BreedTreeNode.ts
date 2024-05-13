import { IVSet } from "@/core/ctx/PokemonBreedTreeContext"
import { z } from "zod"
import {
    PokemonEggGroup,
    PokemonGender,
    PokemonGenderSchema,
    PokemonIv,
    PokemonNature,
    PokemonSpecies,
} from "../pokemon"
import { PokemonBreedTreePosition } from "./BreedTreePosition"
import type { PokemonBreedTreeMap } from "./useBreedTreeMap"

export const PokemonBreedTreeNodeSerializedSchema = z.object({
    species: z.number().optional(),
    gender: PokemonGenderSchema.optional(),
    nickname: z.string().optional(),
})
export type PokemonBreedTreeNodeSerialized = z.infer<typeof PokemonBreedTreeNodeSerializedSchema>

export type IPokemonBreedTreeNode = {
    position: PokemonBreedTreePosition
    species?: PokemonSpecies
    gender?: PokemonGender
    nature?: PokemonNature
    ivs?: PokemonIv[]
    nickname?: string
    genderCostIgnored?: boolean
}

export class PokemonBreedTreeNode implements IPokemonBreedTreeNode {
    position: PokemonBreedTreePosition
    species?: PokemonSpecies | undefined
    gender?: PokemonGender | undefined
    nature?: PokemonNature | undefined
    ivs?: PokemonIv[] | undefined
    nickname?: string | undefined
    genderCostIgnored?: boolean

    constructor(p: IPokemonBreedTreeNode) {
        this.position = p.position
        this.species = p.species
        this.gender = p.gender
        this.nature = p.nature
        this.ivs = p.ivs
        this.nickname = p.nickname
    }

    static EMPTY(pos: PokemonBreedTreePosition): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode({ position: pos })
    }

    static ROOT(breedTarget: { species?: PokemonSpecies; nature?: PokemonNature; ivs: IVSet }): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode({
            position: new PokemonBreedTreePosition(0, 0),
            species: breedTarget.species,
            ivs: Object.values(breedTarget.ivs).filter(Boolean),
            nature: breedTarget.nature,
        })
    }

    public toSerialized(): PokemonBreedTreeNodeSerialized {
        return {
            species: this.species?.number,
            gender: this.gender,
            nickname: this.nickname,
        }
    }

    public getChildNode(map: PokemonBreedTreeMap): PokemonBreedTreeNode | undefined {
        const childRow = this.position.row - 1
        const childCol = Math.floor(this.position.col / 2)
        const childPosition = new PokemonBreedTreePosition(childRow, childCol)

        return map[childPosition.key()]
    }

    public getPartnerNode(map: PokemonBreedTreeMap): PokemonBreedTreeNode | undefined {
        const partnerCol = (this.position.col & 1) === 0 ? this.position.col + 1 : this.position.col - 1
        const partnerPos = new PokemonBreedTreePosition(this.position.row, partnerCol)

        return map[partnerPos.key()]
    }

    public getParentNodes(map: PokemonBreedTreeMap): [PokemonBreedTreeNode, PokemonBreedTreeNode] | undefined {
        const parentRow = this.position.row + 1
        const parentCol = this.position.col * 2

        const parent1 = map[new PokemonBreedTreePosition(parentRow, parentCol).key()]
        const parent2 = map[new PokemonBreedTreePosition(parentRow, parentCol + 1).key()]

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

    public setSpecies(species?: PokemonSpecies): PokemonBreedTreeNode {
        this.species = species
        return this
    }

    public setNature(nature?: PokemonNature): PokemonBreedTreeNode {
        this.nature = nature
        return this
    }

    public setIvs(ivs?: PokemonIv[]): PokemonBreedTreeNode {
        this.ivs = ivs
        return this
    }

    public setGender(gender?: PokemonGender): PokemonBreedTreeNode {
        this.gender = gender
        return this
    }

    public setNickname(nickname?: string): PokemonBreedTreeNode {
        this.nickname = nickname
        return this
    }

    public setGenderCostIgnored(ignored: boolean): PokemonBreedTreeNode {
        this.genderCostIgnored = ignored
        return this
    }
}
