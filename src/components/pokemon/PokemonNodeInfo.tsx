import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreedContext } from "@/contexts/breed-context/store"
import { getHeldItemForNode, HeldItem } from "@/core/held-item"
import { Data } from "@/lib/data"
import { pascalToSpacedPascal, randomString } from "@/lib/utils"
import React from "react"
import { PokemonNodeGender } from "./PokemonNodeGender"
import { PokemonNodeHeldItem } from "./PokemonNodeHeldItem"
import { PokemonNodeNickname } from "./PokemonNodeNickname"
import type { PokemonNode } from "@/core/node"

interface PokemonNodeInfoProps {
  currentNode: PokemonNode
}

export const PokemonNodeInfo: React.FC<PokemonNodeInfoProps> = ({
  currentNode,
}) => {
  const ctx = React.use(BreedContext)
  const heldItem = getHeldItemForNode(currentNode, ctx.breedMap)

  function resetNode() {
    currentNode.reset()
    ctx.updateBreedTree()
  }

  return (
    <Card className="relative h-fit w-full md:ml-4 md:max-w-64">
      <CardHeader>
        <CardTitle className="flex items-center">
          {currentNode && currentNode.species ? (
            <div className="flex items-center">
              {currentNode.species ? (
                <div
                  className="mb-1"
                  style={{
                    width: currentNode.species.spriteMeta.width,
                    height: currentNode.species.spriteMeta.height,
                    backgroundImage: `url(${Data.spritesheet})`,
                    backgroundPosition: `-${currentNode.species.spriteMeta.x}px -${currentNode.species.spriteMeta.y}px`,
                    imageRendering: "pixelated",
                    backgroundRepeat: "no-repeat",
                  }}
                  aria-hidden
                />
              ) : null}
              <PokemonNodeNickname currentNode={currentNode} />
            </div>
          ) : null}
        </CardTitle>
        {!currentNode.isRootNode() ? (
          <div className="absolute -top-4 -left-3 flex flex-col-reverse items-center gap-1">
            <PokemonNodeGender currentNode={currentNode} />
            <PokemonNodeHeldItem
              item={
                currentNode.nature
                  ? HeldItem.Nature
                  : (heldItem ?? ("" as HeldItem))
              }
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pl-9">
        {currentNode.ivs ? (
          <>
            <p className="-mb-1 font-bold">Ivs</p>
            {currentNode.ivs.map((iv) => (
              <span className="text-sm" key={randomString(4)}>
                31 {pascalToSpacedPascal(iv)}
              </span>
            ))}
          </>
        ) : null}
        {currentNode.nature ? (
          <>
            <p className="-mb-1 font-bold">Nature</p>
            <span className="text-sm">{currentNode.nature}</span>
          </>
        ) : null}
        {currentNode.species ? (
          <>
            <p className="-mb-1 font-bold">Egg Groups</p>
            <p>
              <span className="text-sm">
                {currentNode.species!.eggGroups[0]}
                {currentNode.species?.eggGroups[1]
                  ? `, ${currentNode.species.eggGroups[1]}`
                  : null}
              </span>
            </p>
            {!currentNode.isRootNode() ? (
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
