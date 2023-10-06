import { isEven } from "@/lib/utils"
import { Position } from "./types"

export function parsePosition(pos: Position) {
    const [row, col] = pos.split(",")
    return { row: parseInt(row), col: parseInt(col) }
}

export function getBreedPartnerPosition(position: Position): Position {
    const colRow = position.split(",")
    const row = Number(colRow[0])
    const col = Number(colRow[1])

    let breedPartnerRow = row
    let breedPartnerCol = -1

    if (isEven(col)) {
        breedPartnerCol = col + 1
    } else {
        breedPartnerCol = col - 1
    }

    return `${breedPartnerRow},${breedPartnerCol}` as Position
}

export const genderlessEggtypes = ["Ditto", "Genderless"] as const

/**
 * This is for getting valid breeding pokemon of a specified genderless species
 */
export class GenderlessPokemonEvolutionTree {
    static readonly Magnemite = ["Magnemite", "Magneton", "Magnezone"]
    static readonly Magneton = this.Magnemite
    static readonly Magnezone = this.Magnemite

    static readonly Staryu = ["Staryu", "Starmie"]
    static readonly Starmie = this.Staryu

    static readonly Bronzor = ["Bronzor", "Bronzong"]
    static readonly Bronzong = this.Bronzor

    static readonly Beldum = ["Beldum", "Metang", "Metagross"]
    static readonly Metang = this.Beldum
    static readonly Metagross = this.Beldum

    static readonly Baltoy = ["Baltoy", "Claydol"]
    static readonly Claydol = this.Baltoy

    static readonly Voltorb = ["Voltorb", "Electrode"]
    static readonly Electrode = this.Voltorb

    static readonly Porygon = ["Porygon", "Porygon2", "Porygon-Z"]
    static readonly Porygon2 = this.Porygon
    static readonly "Porygon-Z" = this.Porygon

    static readonly Klink = ["Klink", "Klang", "Klinklang"]
    static readonly Klang = this.Klink
    static readonly Klinklang = this.Klink

    static readonly Golett = ["Golett", "Golurk"]
    static readonly Golurk = this.Golett
}
