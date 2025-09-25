import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PokemonNodeGender } from "./PokemonNodeGender"
import { PokemonNodeHeldItem } from "./PokemonNodeHeldItem"
import { PokemonNodeNickname } from "./PokemonNodeNickname"
import { Button } from "@/components/ui/button"
import { pascalToSpacedPascal, randomString } from "@/lib/utils"
import { getHeldItemForNode, HeldItem } from "@/core/held-item"
import type { PokemonNode } from "@/core/breed-map/node"
import type { PokemonBreedMap } from "@/core/breed-map"
import { BreedContext } from "@/contexts/breed-context/store"
import { MONSTERS_SPRITESHEET } from "@/data/app-data"

export function PokemonNodeInfo(props: {
  desired31IvCount: number
  currentNode: PokemonNode
  breedTree: PokemonBreedMap
  updateBreedTree: () => void
}) {
  const ctx = React.use(BreedContext)
  const heldItem = getHeldItemForNode(props.currentNode, props.breedTree)

  function resetNode() {
    props.currentNode.gender = undefined
    props.currentNode.species = undefined
    props.updateBreedTree()
    ctx.save()
  }

  return (
    <Card className="relative h-fit w-full md:ml-4 md:max-w-64">
      <CardHeader>
        <CardTitle className="flex items-center">
          {props.currentNode && props.currentNode.species ? (
            <div className="flex items-center">
              {props.currentNode.species ? (
                <div
                  className="mb-1"
                  style={{
                    width: props.currentNode.species.spriteMeta.width,
                    height: props.currentNode.species.spriteMeta.height,
                    backgroundImage: `url(${MONSTERS_SPRITESHEET})`,
                    backgroundPosition: `-${props.currentNode.species.spriteMeta.x}px -${props.currentNode.species.spriteMeta.y}px`,
                    imageRendering: "pixelated",
                    backgroundRepeat: "no-repeat",
                  }}
                  aria-hidden
                />
              ) : null}
              <PokemonNodeNickname
                currentNode={props.currentNode}
                updateBreedTree={props.updateBreedTree}
              />
            </div>
          ) : null}
        </CardTitle>
        {!props.currentNode.isRootNode() ? (
          <div className="absolute -top-4 -left-3 flex flex-col-reverse items-center gap-1">
            <PokemonNodeGender
              desired31IvCount={props.desired31IvCount}
              currentNode={props.currentNode}
              breedTree={props.breedTree}
              updateBreedTree={props.updateBreedTree}
            />
            <PokemonNodeHeldItem
              item={
                //if not natured, ivs must exist.
                props.currentNode.nature ? HeldItem.Nature : heldItem!
              }
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pl-9">
        {props.currentNode.ivs ? (
          <>
            <p className="-mb-1 font-bold">Ivs</p>
            {props.currentNode.ivs.map((iv) => (
              <span className="text-sm" key={randomString(4)}>
                31 {pascalToSpacedPascal(iv)}
              </span>
            ))}
          </>
        ) : null}
        {props.currentNode.nature ? (
          <>
            <p className="-mb-1 font-bold">Nature</p>
            <span className="text-sm">{props.currentNode.nature}</span>
          </>
        ) : null}
        {props.currentNode.species ? (
          <>
            <p className="-mb-1 font-bold">Egg Groups</p>
            <p>
              <span className="text-sm">
                {props.currentNode.species!.eggGroups[0]}
                {props.currentNode.species?.eggGroups[1]
                  ? `, ${props.currentNode.species.eggGroups[1]}`
                  : null}
              </span>
            </p>
            {!props.currentNode.isRootNode() ? (
              <Button
                onClick={resetNode}
                className="mt-2"
                variant={"destructive"}
                size={"sm"}
              >
                Reset
              </Button>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
