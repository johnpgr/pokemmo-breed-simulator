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
        assert.exists(row)
        assert.exists(col)
        assert(!isNaN(row) && !isNaN(col), "Invalid BreedTreeNode key")

        return new PokemonBreedTreePosition(row, col)
    }
}
