export function assert(condition: unknown, message?: string): asserts condition {
    if (condition === false) throw new Error(message)
}

assert.exists = function <T>(x: T, message?: string): asserts x is NonNullable<T> {
    if (x === undefined || x === null) {
        throw new Error(`Expected value to be defined (${message ?? ""})`)
    }
}
