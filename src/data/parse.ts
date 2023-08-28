import fs from "node:fs"
import csvParser from "csv-parser"
import type { EggType, Pokemon } from "./types"
import path from "node:path"

const skippedPokemons = [
  "Mega",
  "Partner",
  "Alolan",
  "Galarian",
  "Castform ",
  "Wormadam Sandy Cloak",
  "Wormadam Trash Cloak",
  "Wash",
  "Frost",
  "Heat",
  "Fan",
  "Mow",
  "Basculin Blue-Striped Form",
  "Darmanitan Zen Mode",
]

const fixPokemonEggGroups = {
  Nidorina: {
    eggType1: "Field",
    eggType2: "Monster",
  },
  Nidoqueen: {
    eggType1: "Field",
    eggType2: "Monster",
  },
} as const

function parseEggType(eggType: string): EggType | undefined {
  switch (eggType) {
    case "Water 1":
      return "Water A"
    case "Water 2":
      return "Water B"
    case "Water 3":
      return "Water C"
    case "Undiscovered":
      return "Cannot Breed"
    case "Human-Like":
      return "Humanoid"
    case "":
      return undefined
    default:
      return eggType as EggType
  }
}

function parseName(name: string): string {
  switch (name) {
    case "Wormadam Plant Cloak":
      return "Wormadam"
    case "Basculin Red-Striped Form":
      return "Basculin"
    case "Darmanitan Standard Mode":
      return "Darmanitan"
    default:
      return name
  }
}

;(() => {
  const pokemons: Array<Pokemon> = []

  fs.createReadStream(path.resolve(__dirname, "pokemon_data.csv"), "utf8")
    .pipe(
      csvParser({
        mapHeaders: ({ header }) => header.trim(),
      }),
    )
    .on("data", (row) => {
      if (
        skippedPokemons.some((name) => (row["name"] as string).startsWith(name))
      ) {
        return
      }

      const pokemon: Pokemon = {
        pokedexNumber: parseInt(row["pokedex_number"]),
        name: parseName(row["name"]),
        types: [row["type_1"], row["type_2"]].filter(Boolean),
        eggTypes: [
          parseEggType(row["egg_type_1"]),
          parseEggType(row["egg_type_2"]),
        ].filter(Boolean) as Array<EggType>,
        percentageMale: parseFloat(row["percentage_male"]),
      }

      const fix =
        fixPokemonEggGroups[pokemon.name as keyof typeof fixPokemonEggGroups]

      if (fix) {
        pokemon.eggTypes[0] = fix.eggType1
        pokemon.eggTypes[1] = fix.eggType2
      }

      pokemons.push(pokemon)
    })
    .on("end", () => {
      fs.writeFileSync(
        path.resolve(__dirname, "data.json"),
        JSON.stringify(pokemons, null, 2),
      )
    })
})()
