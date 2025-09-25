import React from "react"
import type { BreedErrors } from "./PokemonBreedTreeView"
import type { PokemonBreedMapPosition } from "@/core/breed-map/position"
import type { PokemonBreedMap } from "@/core/breed-map"

const LineDirection = {
  Left: "LEFT",
  Right: "RIGHT",
} as const
type LineDirection = (typeof LineDirection)[keyof typeof LineDirection]

export function PokemonNodeLines(props: {
  position: PokemonBreedMapPosition
  rowLength: number
  breedTree: PokemonBreedMap
  breedErrors: BreedErrors
  children: React.ReactNode
}) {
  const size = 100 / props.rowLength
  const node = props.breedTree[props.position.key]
  if (!node) return null

  const partnerNode = node.getPartnerNode(props.breedTree)

  // Root node
  if (!partnerNode) {
    return (
      <div
        style={{ flexBasis: `${size}%` }}
        className="relative flex items-center justify-center"
      >
        {props.children}
      </div>
    )
  }

  const lineDirection =
    partnerNode.position.col > node.position.col
      ? LineDirection.Left
      : LineDirection.Right

  const hasError =
    props.breedErrors[node.position.key] ||
    props.breedErrors[partnerNode.position.key]

  const color = (() => {
    if (hasError) return "bg-red-500"
    if (node.species && node.gender && partnerNode.species && partnerNode.gender) {
      return "bg-green-500"
    }
    return "bg-foreground"
  })()

  return (
    <div
      style={{ flexBasis: `${size}%` }}
      className="relative flex items-center justify-center"
    >
      {props.children}
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
