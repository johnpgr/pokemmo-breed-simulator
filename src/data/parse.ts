import path from 'node:path'
import fs from 'node:fs'
import csvParser from 'csv-parser'
import { EggGroup, Pokemon } from './types'

const dataPath = path.resolve(__dirname, 'pokemon_data.csv')
const unavailablePokemons = ['Mega', 'Partner', 'Alolan', 'Galarian']

const fixPokemonEggGroups = {
    Nidorina: {
        eggType1: 'Field',
        eggType2: 'Monster',
    },
    Nidoqueen: {
        eggType1: 'Field',
        eggType2: 'Monster',
    },
} as const

function parseEggType(eggType: string | null): EggGroup | null {
    switch (eggType) {
        case 'Water 1':
            return 'Water A'
        case 'Water 2':
            return 'Water B'
        case 'Water 3':
            return 'Water C'
        case 'Undiscovered':
            return 'Cannot Breed'
        case 'Human-Like':
            return 'Humanoid'
        default:
            return eggType as EggGroup | null
    }
}

;(() => {
    const pokemons: Pokemon[] = []

    fs.createReadStream(dataPath, 'utf8')
        .pipe(
            csvParser({
                mapHeaders: ({ header }) => header.trim(),
            }),
        )
        .on('data', (row) => {
            if (
                unavailablePokemons.some((name) =>
                    (row['name'] as string).startsWith(name),
                )
            ) {
                return
            }

            const pokemon: Pokemon = {
                name: row['name'],
                type1: row['type_1'],
                type2: row['type_2'] || null,
                eggType1: parseEggType(row['egg_type_1']),
                eggType2: parseEggType(row['egg_type_2'] || null),
                percentageMale: parseFloat(row['percentage_male']),
            }
            const fix =
                fixPokemonEggGroups[
                    pokemon.name as keyof typeof fixPokemonEggGroups
                ]
            if (fix) {
                pokemon.eggType1 = fix.eggType1
                pokemon.eggType2 = fix.eggType2
            }
            pokemons.push(pokemon)
        })
        .on('end', () => {
            fs.writeFileSync(
                path.resolve(__dirname, 'data.json'),
                JSON.stringify(pokemons, null, 4),
            )
        })
})()
