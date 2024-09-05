import { assert } from "@/lib/assert"
import { PokemonBreederKind, PokemonIv } from "./pokemon"

export class PokemonIvSet {
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

    public static readonly DEFAULT = new PokemonIvSet(PokemonIv.HP, PokemonIv.Attack)

    public static fromArray(array: PokemonIv[]): PokemonIvSet {
        assert(array.length >= 2 && array.length <= 5, "PokemonIv length with invalid length")
        return new PokemonIvSet(array[0]!, array[1]!, array[2], array[3], array[4])
    }

    public toArray(): PokemonIv[] {
        return Object.values(this).filter(Boolean)
    }
}
