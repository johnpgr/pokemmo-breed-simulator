import React from "react"
import { IV_COLOR_DICT } from "@/lib/consts"
import { pascalToSpacedPascal } from "@/lib/utils"
import { PokemonIvSet } from "@/core/breed-map/ivset"
import { assert } from "@/lib/utils"
import { BreedContext } from "@/contexts/breed-context/store"

export function PokemonIvColors() {
  const ctx = React.use(BreedContext)
  const target = ctx.breedTree.rootNode
  assert(
    target.ivs !== undefined,
    "PokemonIvColors tried to render without rootNode.ivs being defined",
  )
  const ivSet = PokemonIvSet.fromArray(target.ivs)

  return (
    <div className="mx-auto flex flex-wrap justify-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full p-3"
          style={{
            backgroundColor: IV_COLOR_DICT[ivSet.A],
          }}
        />
        <span className="text-sm">{pascalToSpacedPascal(ivSet.A)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full p-3"
          style={{
            backgroundColor: IV_COLOR_DICT[ivSet.B],
          }}
        />
        <span className="text-sm">{pascalToSpacedPascal(ivSet.B)}</span>
      </div>
      {ivSet.C ? (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full p-3"
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
            className="h-4 w-4 rounded-full p-3"
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
            className="h-4 w-4 rounded-full p-3"
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
            className="h-4 w-4 rounded-full p-3"
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
