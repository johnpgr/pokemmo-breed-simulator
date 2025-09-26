import type { PokemonSpeciesRaw } from "@/core/pokemon"
import speciesJson from "~/data/monster.json"
import evolutionsJson from "~/data/evolutions.json"
import monsterMappingJson from "~/data/sprites.json"
import spriteSheetPng from "~/data/spritesheet.png"

export type MonsterSpriteMeta = {
  x: number
  y: number
  width: number
  height: number
}

export class Data {
  static species: PokemonSpeciesRaw[] = speciesJson
  static evolutions: number[][] = evolutionsJson
  static monsterMapping: Record<number, MonsterSpriteMeta> = Object.fromEntries(
    Object.entries(monsterMappingJson).map(([k, v]) => [Number(k), v]),
  )

  static spritesheet = spriteSheetPng
}
