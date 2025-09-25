"use client"
import { PokemonBreedService, BreedErrorKind, BreedError } from "@/core/breed"
import { PokemonGender } from "@/core/pokemon"
import { assert } from "@/lib/assert"
import { Info } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { ImportExportButton, ResetBreedButton } from "./Buttons"
import { getExpectedBreedCost } from "./PokemonBreedSelect"
import { PokemonIvColors } from "./PokemonIvColors"
import { HeldItem, getHeldItemForNode } from "./PokemonNodeHeldItem"
import { PokemonNodeLines } from "./PokemonNodeLines"
import { PokemonNodeSelect } from "./PokemonNodeSelect"
import {
  BREED_ITEM_COSTS,
  GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE,
} from "./consts"
import { Alert, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import {
  PokemonBreedMap,
  PokemonBreedMapPosition,
  PokemonBreedMapPositionKey,
  PokemonNode,
} from "@/core/PokemonBreedMap"
import { BreedContext } from "@/core/PokemonBreedContext"

// export type BreedErrors = Record<PokemonBreedMapPositionKey, BreedErrorSet | undefined>

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

export function PokemonBreedTreeView() {
  const ctx = React.use(BreedContext)!
  const breeder = new PokemonBreedService(ctx.species, ctx.evolutions)
  const target = ctx.breedTree.rootNode()
  const desired31IvCount = target.ivs?.filter(Boolean).length ?? 0
  const [breedErrors, setBreedErrors] = React.useState<
    Record<PokemonBreedMapPositionKey, BreedError[]>
  >({})
  const expectedCost = getExpectedBreedCost(
    desired31IvCount,
    Boolean(target.nature),
  )
  const lastRowIdx = target.nature ? desired31IvCount : desired31IvCount - 1
  const currentBreedCost = getCurrentBreedCost(ctx.breedTree.map, lastRowIdx)

  function updateBreedTree() {
    ctx.breedTree.setMap((prev) => ({ ...prev }))
  }

  function deleteErrors(pos: PokemonBreedMapPositionKey) {
    setBreedErrors((prev) => {
      delete prev[pos]
      return { ...prev }
    })
  }

  function addErrors(pos: PokemonBreedMapPositionKey, errors: BreedError[]) {
    setBreedErrors((prev) => {
      prev[pos] = errors
      return { ...prev }
    })
  }

  function handleRestartBreed() {
    ctx.reset()
    window.location.reload()
  }

  React.useEffect(() => {
    ctx.load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (target.species) ctx.save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.breedTree.map])

  React.useEffect(
    function showNotifications() {
      Object.entries(breedErrors).map(([key, errorKind]) => {
        if (!errorKind) {
          return
        }

        const node = ctx.breedTree.map[key]
        if (!node?.species) {
          return
        }

        const partner = node.getPartnerNode(ctx.breedTree.map)
        if (!partner?.species) {
          return
        }

        let errorMsg = ""
        for (const error of errorKind.values()) {
          if (error.kind === BreedErrorKind.ChildDidNotChange) {
            continue
          }
          errorMsg += error.kind
          errorMsg += ", "
        }

        if (errorMsg.endsWith(", ")) {
          errorMsg = errorMsg.slice(0, -2)
        }

        toast.error(
          `${node.species.name} cannot breed with ${partner.species.name}.`,
          {
            description: `Error codes: ${errorMsg}`,
            action: {
              label: "Dismiss",
              onClick: () => {},
            },
          },
        )
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [breedErrors],
  )

  React.useEffect(
    function iterateBreedTree() {
      const lastRow = target.nature ? desired31IvCount : desired31IvCount - 1
      const rowLength = Math.pow(2, lastRow)
      const updates: Record<PokemonBreedMapPositionKey, PokemonNode> = {}

      //inc by 2 because we only want to breed() on one parent
      for (let col = 0; col < rowLength; col += 2) {
        const pos = new PokemonBreedMapPosition(lastRow, col)
        let node = ctx.breedTree.map[pos.key()]
        let partnerNode = node?.getPartnerNode(ctx.breedTree.map)

        const next = () => {
          node = node?.getChildNode(ctx.breedTree.map)
          partnerNode = node?.getPartnerNode(ctx.breedTree.map)
        }

        while (node && partnerNode) {
          // bind the current node position because next() will move the node pointer before the errors are set
          const currentNodePos = node.position.key()

          if (
            !node.gender ||
            !partnerNode.gender ||
            !node.species ||
            !partnerNode.species
          ) {
            deleteErrors(currentNodePos)
            next()
            continue
          }

          const childNode = node.getChildNode(ctx.breedTree.map)
          if (!childNode) {
            break
          }

          const breedResult = breeder.breed(node, partnerNode, childNode)

          if (!breedResult.success) {
            if (
              breedResult.errors.length === 1 &&
              breedResult.errors[0]!.kind === BreedErrorKind.ChildDidNotChange
            ) {
              deleteErrors(currentNodePos)
              next()
              continue
            }

            addErrors(currentNodePos, breedResult.errors)
            next()
            continue
          }

          if (childNode.isRootNode()) {
            deleteErrors(currentNodePos)
            next()
            continue
          }

          const newNode = childNode.clone()
          newNode.species = breedResult.species
          newNode.gender = childNode.rollGender()

          updates[newNode.position.key()] = newNode
          deleteErrors(currentNodePos)
          next()
        }
      }

      if (Object.keys(updates).length > 0) {
        ctx.breedTree.setMap((prev) => ({
          ...prev,
          ...updates,
        }))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      ctx.breedTree.map,
      target.nature,
      desired31IvCount,
      ctx.breedTree.setMap,
      setBreedErrors,
    ],
  )

  if (!target.species) return null

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 mx-auto">
        {process.env.NODE_ENV === "development" ? (
          <div className="space-x-4">
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => console.log(ctx.breedTree.map)}
            >
              Debug (Breed Tree)
            </Button>
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => console.log(breedErrors)}
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
        <ResetBreedButton handleRestartBreed={handleRestartBreed} />
      </div>
      <Alert className="mx-auto w-fit">
        <AlertTitle className="flex items-center gap-2">
          <Info size={20} />
          Current breed cost: ${currentBreedCost} / Expected cost: $
          {expectedCost}
        </AlertTitle>
      </Alert>
      <PokemonIvColors />
      <ScrollArea className="max-w-screen-xl w-full 2xl:max-w-screen-2xl mx-auto">
        <div className="w-full flex flex-col-reverse items-center gap-8">
          {Array.from({
            length: target.nature ? desired31IvCount + 1 : desired31IvCount,
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
                      key={`node:${position.key()}`}
                      position={position}
                      rowLength={rowLength}
                      breedTree={ctx.breedTree.map}
                      breedErrors={breedErrors}
                    >
                      <PokemonNodeSelect
                        desired31IvCount={desired31IvCount}
                        position={position}
                        breedTree={ctx.breedTree.map}
                        updateBreedTree={updateBreedTree}
                      />
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
