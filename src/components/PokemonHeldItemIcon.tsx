"use client"
import { BASE_ITEM_SPRITES_URL } from "@/lib/consts"

function getEvItemSprite(item: string) {
    if (item === "everstone") return `${BASE_ITEM_SPRITES_URL}/hold-item/${item}.png`

    return `${BASE_ITEM_SPRITES_URL}/ev-item/${item}.png`
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

export function HeldItemIcon(props: { item: HeldItem }) {
    return (
        <div className="rounded-full border h-fit w-fit bg-secondary absolute -top-2 -right-2">
            <img
                src={getEvItemSprite(props.item)}
                alt={`Held item: ${props.item}`}
                style={{
                    imageRendering: "pixelated",
                }}
            />
        </div>
    )
}
