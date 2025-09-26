import type { PokemonNode } from "./node"
import { PokemonIv } from "./pokemon"
import type { PokemonBreedMap } from "./types"

export const HeldItem = {
  HP: "power-weight",
  Attack: "power-bracer",
  Defense: "power-belt",
  SpecialAttack: "power-lens",
  SpecialDefense: "power-band",
  Speed: "power-anklet",
  Nature: "everstone",
} as const

export type HeldItem = (typeof HeldItem)[keyof typeof HeldItem]

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