"use client"
import type { PokemonIv } from "@/core/pokemon"
import { IvColor, IV_COLOR_DICT } from "./consts"
import { pascalToSpacedPascal } from "@/lib/utils"
import { useBreedContext } from "@/core/PokemonBreedContext"
import { PokemonIvSet } from "@/core/PokemonIvSet"
import { assert } from "@/lib/assert"

export function PokemonIvColors() {
    const ctx = useBreedContext()
    const target = ctx.breedTree.rootNode()
    assert(target.ivs !== undefined, "PokemonIvColors tried to render without rootNode.ivs being defined")
    const ivSet = PokemonIvSet.fromArray(target.ivs)

    return (
        <div className="flex flex-wrap justify-center gap-4 mx-auto">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ivSet.A],
                    }}
                />
                <span className="text-sm">{pascalToSpacedPascal(ivSet.A)}</span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ivSet.B],
                    }}
                />
                <span className="text-sm">{pascalToSpacedPascal(ivSet.B)}</span>
            </div>
            {ivSet.C ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ivSet.C],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ivSet.C)}</span>
                </div>
            ) : null}
            {ivSet.D ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ivSet.D],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ivSet.D)}</span>
                </div>
            ) : null}
            {ivSet.E ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ivSet.E],
                        }}
                    />
                    <span className="text-sm">{pascalToSpacedPascal(ivSet.E)}</span>
                </div>
            ) : null}
            {target.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: IV_COLOR_DICT["Nature"],
                        }}
                    />
                    <span className="text-sm">{target.nature}</span>
                </div>
            ) : null}
        </div>
    )
}

export function getColorsByIvs(ivs: PokemonIv[]): IvColor[] {
    return ivs.map((iv) => IV_COLOR_DICT[iv])
}
