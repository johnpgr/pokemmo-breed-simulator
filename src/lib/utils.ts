import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { assert } from "./assert"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function run<T>(fn: () => T): T {
    return fn()
}

export namespace Strings {
    export function random(length: number) {
        return Math.random()
            .toString(36)
            .substring(2, 2 + length)
    }

    export function pascalToSpacedPascal(input: string) {
        return input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase())
    }

    export function kebabToSpacedPascal(input: string): string {
        return input
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")
    }

    export function capitalize(input: string) {
        assert(input[0])

        return input[0].toUpperCase() + input.slice(1)
    }
}
