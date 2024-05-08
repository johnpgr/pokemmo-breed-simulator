export type Result<T, E> = (T & { readonly ok: true }) | { readonly ok: false; error: E }

export type WithoutOk<T> = T extends { ok: any } ? never : T

export function Ok<T extends object>(result: WithoutOk<T>): Result<T, never> {
    if (typeof result !== "object" || result === null) {
        throw new Error("Ok() must be passed an object")
    }

    Object.defineProperty(result, "ok", {
        value: true,
        enumerable: true,
        writable: false,
    })

    return result as Result<T, never>
}

export function Err<E>(error: E): Result<never, E> {
    const result = { error }
    Object.defineProperty(result, "ok", {
        value: false,
        enumerable: true,
        writable: false,
    })
    return result as Result<never, E>
}

export function Try<T>(fn: (...args: any[]) => T): Result<T, Error>
export function Try<T>(promise: Promise<T>): Promise<Result<T, Error>>
export function Try(fnOrPromise: Promise<any> | ((...args: any[]) => any)) {
    if (isPromise(fnOrPromise)) {
        return fnOrPromise.then(Ok).catch(Err)
    }

    try {
        const result = fnOrPromise()
        if (isPromise(result)) {
            return result.then(Ok).catch(Err)
        }
        return Ok(result ?? {})
    } catch (error) {
        return Err(error)
    }
}

export function isPromise(x: any): x is Promise<any> {
    return (
        x instanceof Promise ||
        (typeof x === "object" &&
            "then" in x &&
            (x[Symbol.toStringTag] === "PrismaPromise" || x[Symbol.toStringTag] === "Promise"))
    )
}
