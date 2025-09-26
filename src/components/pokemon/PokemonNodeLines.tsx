import React from "react"
import type { PokemonBreedMapPosition } from "@/core/position"
import { BreedContext } from "@/contexts/breed-context/store"

const LineDirection = {
  Left: "LEFT",
  Right: "RIGHT",
} as const
type LineDirection = (typeof LineDirection)[keyof typeof LineDirection]

interface PokemonNodeLinesProps {
  position: PokemonBreedMapPosition
  rowLength: number
  children: React.ReactNode
}

export const PokemonNodeLines: React.FC<PokemonNodeLinesProps> = ({
  children,
  position,
  rowLength,
}) => {
  const ctx = React.use(BreedContext)
  const size = 100 / rowLength
  const node = ctx.breedMap[position.key]
  if (!node) return null

  const partnerNode = node.getPartnerNode(ctx.breedMap)

  // Root node
  if (!partnerNode) {
    return (
      <div
        style={{ flexBasis: `${size}%` }}
        className="relative flex items-center justify-center"
      >
        {children}
      </div>
    )
  }

  const lineDirection =
    partnerNode.position.col > node.position.col
      ? LineDirection.Left
      : LineDirection.Right

  const hasError =
    ctx.breedErrors[node.position.key] ||
    ctx.breedErrors[partnerNode.position.key]

  const color = (() => {
    if (hasError) return "bg-red-500"
    if (
      node.species &&
      node.gender &&
      partnerNode.species &&
      partnerNode.gender
    ) {
      return "bg-green-500"
    }
    return "bg-foreground"
  })()

  return (
    <div
      style={{ flexBasis: `${size}%` }}
      className="relative flex items-center justify-center"
    >
      {children}
      <div
        className={`absolute h-[1px] w-1/2 ${color} ${lineDirection === LineDirection.Left ? "translate-x-1/2" : "-translate-x-1/2"}`}
      ></div>
      {lineDirection === LineDirection.Left ? (
        <div
          className={`absolute h-16 w-[1px] ${color} -bottom-[46px] left-full`}
        ></div>
      ) : null}
    </div>
  )
}
