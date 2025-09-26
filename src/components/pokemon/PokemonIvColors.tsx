import React from "react"
import { IV_COLOR_DICT } from "@/lib/consts"
import { pascalToSpacedPascal } from "@/lib/utils"
import { assert } from "@/lib/utils"
import { BreedContext } from "@/contexts/breed-context/store"

export function PokemonIvColors() {
  const ctx = React.use(BreedContext)
  const target = ctx.breedTarget
  assert(
    target && target.ivSet !== undefined,
    "PokemonIvColors tried to render without rootNode.ivs being defined",
  )

  return (
    <div className="mx-auto flex flex-wrap justify-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full p-3"
          style={{
            backgroundColor: IV_COLOR_DICT[target.ivSet.A],
          }}
        />
        <span className="text-sm">{pascalToSpacedPascal(target.ivSet.A)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full p-3"
          style={{
            backgroundColor: IV_COLOR_DICT[target.ivSet.B],
          }}
        />
        <span className="text-sm">{pascalToSpacedPascal(target.ivSet.B)}</span>
      </div>
      {target.ivSet.C ? (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full p-3"
            style={{
              backgroundColor: IV_COLOR_DICT[target.ivSet.C],
            }}
          />
          <span className="text-sm">
            {pascalToSpacedPascal(target.ivSet.C)}
          </span>
        </div>
      ) : null}
      {target.ivSet.D ? (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full p-3"
            style={{
              backgroundColor: IV_COLOR_DICT[target.ivSet.D],
            }}
          />
          <span className="text-sm">
            {pascalToSpacedPascal(target.ivSet.D)}
          </span>
        </div>
      ) : null}
      {target.ivSet.E ? (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full p-3"
            style={{
              backgroundColor: IV_COLOR_DICT[target.ivSet.E],
            }}
          />
          <span className="text-sm">
            {pascalToSpacedPascal(target.ivSet.E)}
          </span>
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
