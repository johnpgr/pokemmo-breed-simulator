import { assert } from "@/lib/assert"

export class PokemonBreedTreePosition {
    constructor(
        public row: number,
        public col: number,
    ) {}

    public key(): string {
        return `${this.row},${this.col}`
    }

    static fromKey(key: string): PokemonBreedTreePosition {
        const [row, col] = key.split(",").map(Number)
        assert(row !== undefined, "Tried to make a key from invalid string")
        assert(col !== undefined, "Tried to make a key from invalid string")
        assert(!isNaN(row) && !isNaN(col), "Invalid BreedTreeNode key")

        return new PokemonBreedTreePosition(row, col)
    }
}
