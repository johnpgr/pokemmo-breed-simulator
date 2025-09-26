import { PokemonGender } from "@/core/pokemon"
import { assert } from "@/lib/utils"
import { Info } from "lucide-react"
import React from "react"
import { ImportExportButton } from "@/components/ImportExportButton"
import { ResetBreedButton } from "@/components/ResetBreedButton"
import { getExpectedBreedCost } from "@/lib/utils"
import { PokemonIvColors } from "./PokemonIvColors"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import {
  BREED_ITEM_COSTS,
  GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE,
} from "@/lib/consts"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PokemonBreedMapPosition } from "@/core/position"
import type { PokemonNode } from "@/core/node"
import { getHeldItemForNode, HeldItem } from "@/core/held-item"
import { BreedContext } from "@/contexts/breed-context/store"
import type { PokemonBreedMap } from "@/core/types"

function getCurrentBreedCost(
  breedTree: PokemonBreedMap,
  lastRowIdx: number,
): number {
  return Object.values(breedTree).reduce((totalCost, node) => {
    if (!node.species) {
      return totalCost
    }

    const genderCost = getGenderCost(node, lastRowIdx)
    const itemCost = getItemCost(node, breedTree)

    return totalCost + genderCost + itemCost
  }, 0)
}

function getGenderCost(node: PokemonNode, lastRowIdx: number): number {
  if (
    !node.gender ||
    !node.species ||
    node.genderCostIgnored ||
    node.position.row === lastRowIdx
  ) {
    return 0
  }

  const percentageToUse =
    node.gender === PokemonGender.Male
      ? node.species.percentageMale
      : 100 - node.species.percentageMale

  const cost = GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[percentageToUse]
  assert(
    cost !== undefined,
    "tried to get cost in GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE with invalid key",
  )
  return cost
}

function getItemCost(node: PokemonNode, breedTree: PokemonBreedMap): number {
  const heldItem = getHeldItemForNode(node, breedTree)
  if (!heldItem) {
    return 0
  }

  return heldItem === HeldItem.Nature
    ? BREED_ITEM_COSTS.nature
    : BREED_ITEM_COSTS.iv
}

export const PokemonBreedTreeView: React.FC = () => {
  const ctx = React.use(BreedContext)
  if (!ctx.breedTarget) return null

  const lastRowIdx = ctx.breedTarget.nature
    ? ctx.breedTarget.ivCount
    : ctx.breedTarget.ivCount - 1

  const expectedCost = getExpectedBreedCost(
    ctx.breedTarget.ivCount,
    Boolean(ctx.breedTarget.nature),
  )

  const currentBreedCost = getCurrentBreedCost(ctx.breedMap, lastRowIdx)

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex items-center gap-2">
        {import.meta.env.DEV ? (
          <div className="space-x-4">
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => console.log(ctx.breedMap)}
            >
              Debug (Breed Tree)
            </Button>
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => console.log(ctx.breedErrors)}
            >
              Debug (Breed Errors)
            </Button>
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => console.log(ctx)}
            >
              Debug (Context)
            </Button>
          </div>
        ) : null}
        <ImportExportButton
          serialize={() => JSON.stringify(ctx.serialize(), null, 4)}
        />
        <ResetBreedButton />
      </div>
      <Alert className="mx-auto w-fit">
        <AlertTitle className="flex items-center gap-2">
          <Info size={20} />
          Current breed cost: ${currentBreedCost} / Expected cost: $
          {expectedCost}
        </AlertTitle>
      </Alert>
      <PokemonIvColors />
      <ScrollArea className="mx-auto w-full max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex w-full flex-col-reverse items-center gap-8">
          {Array.from({
            length: ctx.breedTarget.nature
              ? ctx.breedTarget.ivCount + 1
              : ctx.breedTarget.ivCount,
          }).map((_, row) => {
            const rowLength = Math.pow(2, row)

            return (
              <div
                key={`row:${row}`}
                className="flex w-full items-center justify-center"
              >
                {Array.from({ length: rowLength }).map((_, col) => {
                  const position = new PokemonBreedMapPosition(row, col)

                  return (
                    <PokemonNodeLines
                      key={`node:${position.key}`}
                      position={position}
                      rowLength={rowLength}
                    >
                      <PokemonNodeSelect position={position} />
                    </PokemonNodeLines>
                  )
                })}
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
