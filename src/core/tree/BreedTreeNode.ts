import { usePokemonToBreed } from "@/components/PokemonToBreedContext"
import type { PokemonGender, PokemonIv, PokemonNature, PokemonSpecies } from "../pokemon"
import { PokemonBreedTreePosition } from "./BreedTreePosition"
import type { PokemonBreedTreeMap } from "./useBreedTreeMap"

export class PokemonBreedTreeNode {
    constructor(
        public position: PokemonBreedTreePosition,
        public species?: PokemonSpecies,
        public gender?: PokemonGender,
        public nature?: PokemonNature,
        public ivs?: PokemonIv[],
        public nickname?: string,
    ) {}

    static EMPTY(pos: PokemonBreedTreePosition): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode(pos)
    }

    static ROOT(ctx: ReturnType<typeof usePokemonToBreed>): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode(
            new PokemonBreedTreePosition(0, 0),
            ctx.pokemon,
            undefined,
            undefined,
            Object.values(ctx.ivs).filter(Boolean),
        )
    }

    public getPartnerNode(map: PokemonBreedTreeMap): PokemonBreedTreeNode | undefined {
        const partnerCol = (this.position.col & 1) === 0 ? this.position.col + 1 : this.position.col - 1

        return map[new PokemonBreedTreePosition(this.position.row, partnerCol).key()]
    }

    public getParentNodes(map: PokemonBreedTreeMap): [PokemonBreedTreeNode, PokemonBreedTreeNode] | undefined {
        const parentRow = this.position.row + 1
        const parentCol = this.position.col * 2

        const parent1 = map[new PokemonBreedTreePosition(parentRow, parentCol).key()]
        const parent2 = map[new PokemonBreedTreePosition(parentRow, parentCol + 1).key()]

        if (!parent1 || !parent2) return undefined

        return [parent1, parent2]
    }
}
