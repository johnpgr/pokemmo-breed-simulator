"use client"
import { useBreedTreeContext } from "./PokemonBreedTreeContext"
import type { PokemonIv } from "@/core/pokemon"
import { pascalToSpacedPascal } from "@/lib/utils"
import { IvColor, IV_COLOR_DICT } from "./consts"

export function PokemonIvColors() {
    const ctx = useBreedTreeContext()

    return (
        <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ctx.ivs.A],
                    }}
                />
                <span className="text-sm">
                    {pascalToSpacedPascal(ctx.ivs.A)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ctx.ivs.B],
                    }}
                />
                <span className="text-sm">
                    {pascalToSpacedPascal(ctx.ivs.B)}
                </span>
            </div>
            {ctx.ivs.C ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.ivs.C],
                        }}
                    />
                    <span className="text-sm">
                        {pascalToSpacedPascal(ctx.ivs.C)}
                    </span>
                </div>
            ) : null}
            {ctx.ivs.D ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.ivs.D],
                        }}
                    />
                    <span className="text-sm">
                        {pascalToSpacedPascal(ctx.ivs.D)}
                    </span>
                </div>
            ) : null}
            {ctx.ivs.E ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.ivs.E],
                        }}
                    />
                    <span className="text-sm">
                        {pascalToSpacedPascal(ctx.ivs.E)}
                    </span>
                </div>
            ) : null}
            {ctx.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT["Nature"],
                        }}
                    />
                    <span className="text-sm">{ctx.nature}</span>
                </div>
            ) : null}
        </div>
    )
}

export function getColorsByIvs(ivs: PokemonIv[]): IvColor[] {
    return ivs.map((iv) => IV_COLOR_DICT[iv])
}
