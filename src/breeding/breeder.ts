import { raise } from "@/lib/utils"
import type { BreedNode, GenderType, Position } from "./types"
import { Gender } from "./consts"
import { genderlessEggtypes, parsePosition } from "./utils"
import { Pokemon } from "@/data/types"
import { ObservableMap } from "mobx"
import { Err, Ok, Result } from "ts-results"

export type BreedNodeAndPosition = {
    position: Position
    breedNode: BreedNode
}

export enum BreedErrorKind {
    GenderCompatibility = "GenderCompatibility",
    EggTypeCompatibility = "EggTypeCompatibility",
    NoPokemon = "NoPokemon",
    UnknownError = "UnknownError",
}

export class BreedError {
    constructor(
        public kind: BreedErrorKind,
        public positions: Array<Position>,
    ) { }
}

export class Breeder {
    constructor(private readonly breedMap: ObservableMap<Position, BreedNode>) { }

    public breed(
        parent1: BreedNodeAndPosition,
        parent2: BreedNodeAndPosition,
    ): Result<{}, BreedError> {
        const resBreedable = this.checkBreedability(parent1, parent2)
        if(resBreedable.err) resBreedable

        const res = this.getBreedChildSpecies(parent1, parent2)
        if(res.err) return res
        const child = res.unwrap()

        const childPosition = this.getChildPosition(parent1, parent2)
        const childGender = this.getChildGender(child)
        const childNode = this.breedMap.get(childPosition)

        this.breedMap.set(childPosition, {
            pokemon: child,
            gender: childGender,
            parents: [parent1.position, parent2.position],
            ivs: childNode?.ivs ?? null,
            nature: childNode?.nature ?? null,
        })

        return Ok({})
    }

    private checkBreedability(parent1: BreedNodeAndPosition, parent2: BreedNodeAndPosition): Result<{}, BreedError> {
        const genderCompatible = parent1.breedNode.gender === parent2.breedNode.gender
        if (!genderCompatible) return Err(new BreedError(BreedErrorKind.GenderCompatibility, [parent1.position, parent2.position]))

        const eggTypeCompatible = parent1.breedNode.pokemon?.eggTypes.some(
            (e) => parent2.breedNode.pokemon?.eggTypes.includes(e),
        )
        if (!eggTypeCompatible) return Err(new BreedError(BreedErrorKind.EggTypeCompatibility, [parent1.position, parent2.position]))

        return Ok({})
    }

    private getBreedChildSpecies(parent1: BreedNodeAndPosition, parent2: BreedNodeAndPosition): Result<Pokemon,BreedError> {
        const pokes = [parent1.breedNode, parent2.breedNode].filter((p) => p.gender === Gender.FEMALE)
        if (pokes.length !== 1) {
            return Err(new BreedError(BreedErrorKind.NoPokemon, [parent1.position, parent2.position]))
        }

        const child = pokes[0].pokemon
        if(!child) return Err(new BreedError(BreedErrorKind.UnknownError, [parent1.position, parent2.position]))

        return Ok(child)
    }

    private getChildPosition(parent1: BreedNodeAndPosition, parent2: BreedNodeAndPosition): Position {
        const parent1Position = parsePosition(parent1.position)
        // const parent2Position = parsePosition(partner.position)
        const childRow = parent1Position.row - 1
        const childCol = Math.floor(parent1Position.col / 2)
        const childPosition = `${childRow},${childCol}`
        // console.log({ childPosition, parent1Position, parent2Position })
        return childPosition as Position
    }

    private getChildGender(child: Pokemon): GenderType {
        if (child.eggTypes.some((e) => genderlessEggtypes.includes(e))) {
            return null
        }
        return Math.random() * 100 > child.percentageMale ? Gender.FEMALE : Gender.MALE
    }
}
