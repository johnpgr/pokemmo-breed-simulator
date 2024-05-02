import fs from "fs"
import path from "path"
import csvParser from "csv-parser"
import { PokemonEggGroup, PokemonSpecies } from "../core/pokemon"

const csvDataPath = path.resolve(import.meta.dirname, "./data.csv")
const jsonDataPath = path.resolve(import.meta.dirname, "./data.json")

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

function fixPokemonEggGroups(pokemon: PokemonSpecies): [PokemonEggGroup, PokemonEggGroup?] {
    switch (pokemon.name) {
        case "Nidorina":
            return [PokemonEggGroup.Field, PokemonEggGroup.Monster]
        case "Nidoqueen":
            return [PokemonEggGroup.Field, PokemonEggGroup.Monster]
        case "Rotom":
            return [PokemonEggGroup.Genderless]
        case "Magnemite":
            return [PokemonEggGroup.Genderless]
        case "Magneton":
            return [PokemonEggGroup.Genderless]
        case "Magnezone":
            return [PokemonEggGroup.Genderless]
        case "Staryu":
            return [PokemonEggGroup.Genderless]
        case "Starmie":
            return [PokemonEggGroup.Genderless]
        case "Bronzor":
            return [PokemonEggGroup.Genderless]
        case "Bronzong":
            return [PokemonEggGroup.Genderless]
        case "Solrock":
            return [PokemonEggGroup.Genderless]
        case "Lunatone":
            return [PokemonEggGroup.Genderless]
        case "Beldum":
            return [PokemonEggGroup.Genderless]
        case "Metang":
            return [PokemonEggGroup.Genderless]
        case "Metagross":
            return [PokemonEggGroup.Genderless]
        case "Baltoy":
            return [PokemonEggGroup.Genderless]
        case "Claydol":
            return [PokemonEggGroup.Genderless]
        case "Voltorb":
            return [PokemonEggGroup.Genderless]
        case "Electrode":
            return [PokemonEggGroup.Genderless]
        case "Porygon":
            return [PokemonEggGroup.Genderless]
        case "Porygon2":
            return [PokemonEggGroup.Genderless]
        case "Porygon-Z":
            return [PokemonEggGroup.Genderless]
        case "Klink":
            return [PokemonEggGroup.Genderless]
        case "Klang":
            return [PokemonEggGroup.Genderless]
        case "Klinklang":
            return [PokemonEggGroup.Genderless]
        case "Cryogonal":
            return [PokemonEggGroup.Genderless]
        case "Golett":
            return [PokemonEggGroup.Genderless]
        case "Golurk":
            return [PokemonEggGroup.Genderless]
        default:
            return pokemon.eggGroups
    }
}

function parseEggGroup(eggGroup: string): PokemonEggGroup | undefined {
    switch (eggGroup) {
        case "Water 1":
            return PokemonEggGroup.WaterA
        case "Water 2":
            return PokemonEggGroup.WaterB
        case "Water 3":
            return PokemonEggGroup.WaterC
        case "Undiscovered":
            return PokemonEggGroup.CannotBreed
        case "Human-Like":
            return PokemonEggGroup.Humanoid
        case "Grass":
            return PokemonEggGroup.Plant
        case "Amorphous":
            return PokemonEggGroup.Chaos
        case "":
            return undefined
        default:
            return eggGroup as PokemonEggGroup
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
        case "Nidoran":
            return "Nidoran ♀"
        case "Nidoran":
            return "Nidoran ♂"
        default:
            return name
    }
}

const pokemons: PokemonSpecies[] = []

fs.createReadStream(csvDataPath, "utf8")
    .pipe(
        csvParser({
            mapHeaders: ({ header }) => header.trim(),
        }),
    )
    .on("data", (row) => {
        if (skippedPokemons.some((name) => (row["name"] as string).startsWith(name))) {
            return
        }

        const parsedEggGroups: PokemonEggGroup[] = []
        const parsedEgg1 = parseEggGroup(row["egg_type_1"])
        const parsedEgg2 = parseEggGroup(row["egg_type_2"])
        if (parsedEgg1) {
            parsedEggGroups.push(parsedEgg1)
        }
        if (parsedEgg2) {
            parsedEggGroups.push(parsedEgg2)
        }

        const pokemon = new PokemonSpecies(
            parseInt(row["pokedex_number"]),
            parseName(row["name"]),
            //@ts-ignore
            [row["type_1"], row["type_2"]].filter(Boolean),
            parsedEggGroups,
            parseFloat(row["percentage_male"]) || 0,
        )

        const fix = fixPokemonEggGroups(pokemon)

        if (fix) {
            pokemon.eggGroups[0] = fix[0]
            if (fix[1]) {
                pokemon.eggGroups[1] = fix[1]
            }
        }

        pokemons.push(pokemon)
    })
    .on("end", () => {
        fs.writeFileSync(jsonDataPath, JSON.stringify(pokemons, null, 4))
    })
