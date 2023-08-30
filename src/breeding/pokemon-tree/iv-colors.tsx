import { IVMap } from "@/context/types"
import { camelToSpacedPascal } from "@/lib/utils"
import React from "react"

export const IvColorMap = {
  hp: "#55b651",
  attack: "#F44336",
  defense: "#f78025",
  specialAttack: "#e925f7",
  specialDefense: "#f7e225",
  speed: "#25e2f7",
} as const
export type Color = (typeof IvColorMap)[keyof typeof IvColorMap]

export function IvColors(props: { ivs: IVMap }) {
  return (
    <div className="flex gap-4 mt-4">
      <div className="flex items-center gap-2">
        <div
          className="rounded-full p-3 h-4 w-4"
          style={{
            backgroundColor: IvColorMap[props.ivs.a],
          }}
        />
        <span className="text-sm">{camelToSpacedPascal(props.ivs.a)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="rounded-full p-3 h-4 w-4"
          style={{
            backgroundColor: IvColorMap[props.ivs.b],
          }}
        />
        <span className="text-sm">{camelToSpacedPascal(props.ivs.b)}</span>
      </div>
      {props.ivs.c ? (
        <div className="flex items-center gap-2">
          <div
            className="rounded-full p-3 h-4 w-4"
            style={{
              backgroundColor: IvColorMap[props.ivs.c],
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
              backgroundColor: IvColorMap[props.ivs.d],
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
              backgroundColor: IvColorMap[props.ivs.e],
            }}
          />
          <span className="text-sm">{camelToSpacedPascal(props.ivs.e)}</span>
        </div>
      ) : null}
    </div>
  )
}
