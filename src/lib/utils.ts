import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BASE_SPRITES_URL } from "./consts"
import { assert } from "./assert"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPokemonSpriteUrl(name: string) {
    const nameFixed = name
        .replace("'", "")
        .replace(" ♂", "-m")
        .replace(" ♀", "-f")
        .replace("Mr. Mime", "mr-mime")
        .replace("Mime Jr.", "mime-jr")

    return `${BASE_SPRITES_URL}/${nameFixed.toLowerCase()}.png`
}

export function randomString(length: number) {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length)
}

export function pascalToSpacedPascal(input: string) {
    return input
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase())
}

export function kebabToSpacedPascal(input: string): string {
    return input
        .split("-")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
}

export function capitalize(input: string) {
    assert.exists(input[0])

    return input[0].toUpperCase() + input.slice(1)
}

export function run<T>(fn: () => T): T {
    return fn()
}
