"use client"
import type { PokemonIv } from "@/core/pokemon"
import { IvColor, IV_COLOR_DICT } from "./consts"
import { pascalToSpacedPascal } from "@/lib/utils"
import { useBreedContext } from "@/core/PokemonBreedContext"

export function PokemonIvColors() {
    const ctx = useBreedContext()

    return (
        <div className="flex flex-wrap justify-center gap-4 mx-auto">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.A],
                    }}
                />
                <span className="text-sm">{pascalToSpacedPascal(ctx.breedTarget.ivs.A)}</span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.B],
                    }}
                />
                <span className="text-sm">{pascalToSpacedPascal(ctx.breedTarget.ivs.B)}</span>
            </div>
            {ctx.breedTarget.ivs.C ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.C],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ctx.breedTarget.ivs.C)}</span>
                </div>
            ) : null}
            {ctx.breedTarget.ivs.D ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.D],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ctx.breedTarget.ivs.D)}</span>
                </div>
            ) : null}
            {ctx.breedTarget.ivs.E ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.E],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ctx.breedTarget.ivs.E)}</span>
                </div>
            ) : null}
            {ctx.breedTarget.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT["Nature"],
                        }}
                    />
                    <span className="text-sm">{ctx.breedTarget.nature}</span>
                </div>
            ) : null}
        </div>
    )
}

export function getColorsByIvs(ivs: PokemonIv[]): IvColor[] {
    return ivs.map((iv) => IV_COLOR_DICT[iv])
}
