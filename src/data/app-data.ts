import type { PokemonSpeciesRaw } from "@/core/pokemon"
import { url } from "@/lib/utils"

export const MONSTERS_SPRITESHEET = url("monsters-spritesheet.png")

export type MonsterSpriteMeta = {
  x: number
  y: number
  width: number
  height: number
}

class AppData {
  private _species: PokemonSpeciesRaw[] | undefined = undefined
  private _evolutions: number[][] | undefined = undefined
  // Use numeric monster IDs as keys. JSON will have string keys, so we
  // convert them to numbers when parsing.
  private _monsterMapping: Record<number, MonsterSpriteMeta> | undefined =
    undefined

  // Initialize species/evolutions/monsterMapping once. Safe to call multiple times.
  async init() {
    if (this._species && this._evolutions && this._monsterMapping !== undefined)
      return

    const [speciesRes, evolutionsRes, monsterMappingRes] = await Promise.all([
      fetch(url("monster.json")).then((r) => r.json()),
      fetch(url("evolutions.json")).then((r) => r.json()),
      // monster-sprites.json has string keys (because JSON keys are strings).
      // Convert them to numeric keys here.
      fetch(url("monster-sprites.json")).then(async (r) => {
        const data = await r.json()
        if (!data || typeof data !== "object") return {}
        const out: Record<number, MonsterSpriteMeta> = {}
        for (const k of Object.keys(data)) {
          const n = Number(k)
          if (Number.isNaN(n)) continue
          out[n] = data[k]
        }
        return out
      }),
    ])

    this._species = speciesRes ?? []
    this._evolutions = evolutionsRes ?? []
    this._monsterMapping = monsterMappingRes ?? {}

    const img = new Image()
    img.src = MONSTERS_SPRITESHEET
    //@ts-expect-error Keep a reference to avoid immediate GC until the browser caches/uses it.
    window.__preloadedMonstersSpritesheet = img
  }

  get species(): PokemonSpeciesRaw[] {
    if (!this._species)
      throw new Error("App data not initialized. Call init() first.")
    return this._species
  }

  get evolutions(): number[][] {
    if (!this._evolutions)
      throw new Error("App data not initialized. Call init() first.")
    return this._evolutions
  }

  get monsterMapping(): Record<number, MonsterSpriteMeta> {
    if (!this._monsterMapping) {
      throw new Error("App data not initialized. Call init() first.")
    }
    return this._monsterMapping
  }
}

export default new AppData()
