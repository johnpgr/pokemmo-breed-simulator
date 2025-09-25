import { PokemonEggGroup, PokemonSpecies, PokemonType } from "@/core/pokemon"
import { capitalize } from "@/lib/utils"
import fs from "fs"
import path from "path"

const monsters = (await (
  await fetch(
    "https://raw.githubusercontent.com/PokeMMO-Tools/pokemmo-hub/6fe1ef4e748c8862ba9549a3de44d669e015177e/src/data/pokemmo/monster.json",
  )
).json()) as any[]

const species = [] as PokemonSpecies[]
const evolutions: number[][] = []

const multiform = ["Wormadam", "Rotom", "Castform", "Darmanitan", "Basculin"]

function parseEggGroups(input: string[]): [PokemonEggGroup, PokemonEggGroup?] {
  return input.map((it) => {
    const parts = it.split(" ")
    if (parts.length > 1) {
      return (capitalize(parts[0]!) + capitalize(parts[1]!)) as PokemonEggGroup
    }
    return capitalize(parts[0]!)
  }) as [PokemonEggGroup, PokemonEggGroup?]
}

function parseTypes(input: string[]): [PokemonType, PokemonType?] {
  const deduped = new Set(input)
  return Array.from(deduped).map(capitalize) as [PokemonType, PokemonType?]
}

function parsePercentageMale(input: number): number {
  switch (input) {
    case 255:
      return 0
    case 254:
      return 0
    case 127:
      return 50
    case 31:
      return 87.5
    case 191:
      return 25
    case 63:
      return 75
    case 0:
      return 100
    default:
      throw new Error("Missed case in parsePercentageMale: " + input)
  }
}

class EvolutionTrees {
  constructor(public data: number[][] = []) {}

  private recAddEvoTree(id: number, accumulator: number[] = []): number[] {
    accumulator.push(id)
    const raw = monsters.find((m) => m.id === id)
    const evos = raw.evolutions?.map((e: any) => e.id)
    evos.forEach((e: any) => this.recAddEvoTree(e, accumulator))
    return accumulator
  }

  public get(id: number): number[] | undefined {
    return this.data.find((tree) => tree.includes(id))
  }

  public add(id: number) {
    if (this.get(id) !== undefined) {
      return
    }
    const t = this.recAddEvoTree(id)
    this.data.push(t)
  }

  public stringify(): string {
    return JSON.stringify(this.data, null, 4)
  }
}

for (const m of monsters as any[]) {
  if (m.id > 667) {
    break
  }

  if (m.egg_groups[0] === "cannot breed") {
    continue
  }

  if (multiform.includes(m.name) && species.find((p) => p.name === m.name)) {
    continue
  }

  species.push(
    new PokemonSpecies(
      m.id,
      m.name,
      parseTypes(m.types),
      parseEggGroups(m.egg_groups),
      parsePercentageMale(m.gender_ratio),
    ),
  )
}

const evoTrees = new EvolutionTrees()

for (const s of species) {
  evoTrees.add(s.id)
}

const monsterPath = path.resolve(import.meta.dirname, "monster.json")
const evolutionsPath = path.resolve(import.meta.dirname, "evolutions.json")

fs.writeFileSync(monsterPath, JSON.stringify(species, null, 4))
fs.writeFileSync(evolutionsPath, evoTrees.stringify())
