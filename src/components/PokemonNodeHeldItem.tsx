"use client"
import { getEvItemSpriteUrl } from "@/lib/sprites"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { PokemonIv } from "@/core/pokemon"
import { kebabToSpacedPascal } from "@/lib/utils"
import { PokemonBreedMap, PokemonNode } from "@/core/PokemonBreedMap"

export function PokemonNodeHeldItem(props: { item: HeldItem }) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"outline"} className="w-fit h-fit p-0 rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getEvItemSpriteUrl(props.item)}
              alt={`Held item: ${props.item}`}
              style={{
                imageRendering: "pixelated",
              }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{kebabToSpacedPascal(props.item)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export enum HeldItem {
  HP = "power-weight",
  Attack = "power-bracer",
  Defense = "power-belt",
  SpecialAttack = "power-lens",
  SpecialDefense = "power-band",
  Speed = "power-anklet",
  Nature = "everstone",
}

export function getHeldItemForNode(
  node: PokemonNode,
  breedTree: PokemonBreedMap,
): HeldItem | null {
  const breedPartner = node.getPartnerNode(breedTree)

  if (!breedPartner) {
    return null
  }

  const ivThatDoesntExistOnBreedPartner =
    node.ivs?.filter((iv) => !breedPartner.ivs?.includes(iv)) ?? []
  if (ivThatDoesntExistOnBreedPartner.length === 0) {
    return null
  }

  switch (ivThatDoesntExistOnBreedPartner[0]) {
    case PokemonIv.HP:
      return HeldItem.HP
    case PokemonIv.Attack:
      return HeldItem.Attack
    case PokemonIv.Defense:
      return HeldItem.Defense
    case PokemonIv.SpecialAttack:
      return HeldItem.SpecialAttack
    case PokemonIv.SpecialDefense:
      return HeldItem.SpecialDefense
    case PokemonIv.Speed:
      return HeldItem.Speed
    default:
      return null
  }
}
