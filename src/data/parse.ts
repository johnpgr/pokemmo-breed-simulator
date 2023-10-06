import fs from "node:fs"
import csvParser from "csv-parser"
import { EggType, IEggType, Pokemon } from "./types"
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
    Nidorina: [EggType.Field, EggType.Monster],
    Nidoqueen: [EggType.Field, EggType.Monster],
    Rotom: [EggType.Genderless],
    Magnemite: [EggType.Genderless],
    Magneton: [EggType.Genderless],
    Magnezone: [EggType.Genderless],
    Staryu: [EggType.Genderless],
    Starmie: [EggType.Genderless],
    Bronzor: [EggType.Genderless],
    Bronzong: [EggType.Genderless],
    Solrock: [EggType.Genderless],
    Lunatone: [EggType.Genderless],
    Beldum: [EggType.Genderless],
    Metang: [EggType.Genderless],
    Metagross: [EggType.Genderless],
    Baltoy: [EggType.Genderless],
    Claydol: [EggType.Genderless],
    Voltorb: [EggType.Genderless],
    Electrode: [EggType.Genderless],
    Porygon: [EggType.Genderless],
    Porygon2: [EggType.Genderless],
    "Porygon-Z": [EggType.Genderless],
    Klink: [EggType.Genderless],
    Klang: [EggType.Genderless],
    Klinklang: [EggType.Genderless],
    Cryogonal: [EggType.Genderless],
    Golett: [EggType.Genderless],
    Golurk: [EggType.Genderless],
} as const

function parseEggType(eggType: string): IEggType | undefined {
    switch (eggType) {
        case "Water 1":
            return EggType.WaterA
        case "Water 2":
            return EggType.WaterB
        case "Water 3":
            return EggType.WaterC
        case "Undiscovered":
            return EggType.CannotBreed
        case "Human-Like":
            return EggType.Humanoid
        case "":
            return undefined
        default:
            return eggType as IEggType
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
            if (skippedPokemons.some((name) => (row["name"] as string).startsWith(name))) {
                return
            }

            const pokemon: Pokemon = {
                pokedexNumber: parseInt(row["pokedex_number"]),
                name: parseName(row["name"]),
                types: [row["type_1"], row["type_2"]].filter(Boolean),
                eggTypes: [parseEggType(row["egg_type_1"]), parseEggType(row["egg_type_2"])].filter(
                    Boolean,
                ) as Array<IEggType>,
                percentageMale: parseFloat(row["percentage_male"]),
            }

            const fix = fixPokemonEggGroups[pokemon.name as keyof typeof fixPokemonEggGroups]

            if (fix) {
                pokemon.eggTypes[0] = fix[0]
                if (fix[1]) {
                    pokemon.eggTypes[1] = fix[1]
                }
            }

            pokemons.push(pokemon)
        })
        .on("end", () => {
            fs.writeFileSync(path.resolve(__dirname, "data.json"), JSON.stringify(pokemons, null, 2))
        })
})()
