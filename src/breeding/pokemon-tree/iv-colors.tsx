import { IVMap } from "@/context/types"
import { NatureType } from "@/data/types"
import { camelToSpacedPascal } from "@/lib/utils"
import React from "react"

export const ColorMap = {
    hp: "#55b651",
    attack: "#F44336",
    defense: "#f78025",
    specialAttack: "#e925f7",
    specialDefense: "#f7e225",
    speed: "#25e2f7",
    nature: "#e0f1f4",
} as const

export type Color = (typeof ColorMap)[keyof typeof ColorMap]

export function IvColors(props: { ivs: IVMap; nature: NatureType | null }) {
    return (
        <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: ColorMap[props.ivs.a],
                    }}
                />
                <span className="text-sm">{camelToSpacedPascal(props.ivs.a)}</span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: ColorMap[props.ivs.b],
                    }}
                />
                <span className="text-sm">{camelToSpacedPascal(props.ivs.b)}</span>
            </div>
            {props.ivs.c ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: ColorMap[props.ivs.c],
                        }}
                    />
                    <span className="text-sm">{camelToSpacedPascal(props.ivs.c)}</span>
                </div>
            ) : null}
            {props.ivs.d ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: ColorMap[props.ivs.d],
                        }}
                    />
                    <span className="text-sm">{camelToSpacedPascal(props.ivs.d)}</span>
                </div>
            ) : null}
            {props.ivs.e ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: ColorMap[props.ivs.e],
                        }}
                    />
                    <span className="text-sm">{camelToSpacedPascal(props.ivs.e)}</span>
                </div>
            ) : null}
            {props.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: ColorMap["nature"],
                        }}
                    />
                    <span className="text-sm">{props.nature}</span>
                </div>
            ) : null}
        </div>
    )
}
