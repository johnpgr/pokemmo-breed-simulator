"use client"
import { usePokemonToBreed } from "./PokemonToBreedContext"
import type { PokemonIv } from "@/core/pokemon"
import { pascalToSpacedPascal } from "@/lib/utils"

export const COLOR_MAP = {
    Hp: "#55b651",
    Attack: "#F44336",
    Defense: "#f78025",
    SpecialAttack: "#e925f7",
    SpecialDefense: "#f7e225",
    Speed: "#25e2f7",
    Nature: "#e0f1f4",
} as const

export type Color = (typeof COLOR_MAP)[keyof typeof COLOR_MAP]

export function IvColors() {
    const ctx = usePokemonToBreed()

    return (
        <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: COLOR_MAP[ctx.ivs.A],
                    }}
                />
                <span className="text-sm">{pascalToSpacedPascal(ctx.ivs.A)}</span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: COLOR_MAP[ctx.ivs.B],
                    }}
                />
                <span className="text-sm">{pascalToSpacedPascal(ctx.ivs.B)}</span>
            </div>
            {ctx.ivs.C ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP[ctx.ivs.C],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ctx.ivs.C)}</span>
                </div>
            ) : null}
            {ctx.ivs.D ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP[ctx.ivs.D],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ctx.ivs.D)}</span>
                </div>
            ) : null}
            {ctx.ivs.E ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP[ctx.ivs.E],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ctx.ivs.E)}</span>
                </div>
            ) : null}
            {ctx.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP["Nature"],
                        }}
                    />
                    <span className="text-sm">{ctx.nature}</span>
                </div>
            ) : null}
        </div>
    )
}

export function getColorsByIvs(ivs: PokemonIv[]): Color[] {
    return ivs.map((iv) => COLOR_MAP[iv])
}
