import { BASE_ITEM_SPRITES_URL } from "@/lib/consts"
import React from "react"

function getEvItemSprite(item: string) {
  if (item === "everstone") return `${BASE_ITEM_SPRITES_URL}/hold-item/${item}.png`

  return `${BASE_ITEM_SPRITES_URL}/ev-item/${item}.png`
}

export const HeldItems = {
  hp: "power-weight",
  attack: "power-bracer",
  defense: "power-belt",
  specialAttack: "power-lens",
  specialDefense: "power-band",
  speed: "power-anklet",
  nature: "everstone",
} as const
export type HeldItem = keyof typeof HeldItems

export function HeldItemsView({ item }: { item: HeldItem }) {
  return (
    <div className="rounded-full border h-fit w-fit bg-secondary absolute -top-2 -right-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getEvItemSprite(HeldItems[item])}
        alt={`Held item: ${item}`}
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  )
}
