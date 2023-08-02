import fs from 'node:fs'
import csvParser from 'csv-parser'
import type { EggGroup, Pokemon } from './types'

const skippedPokemons = [
  'Mega',
  'Partner',
  'Alolan',
  'Galarian',
  'Castform ',
  'Wormadam Sandy Cloak',
  'Wormadam Trash Cloak',
  'Wash',
  'Frost',
  'Heat',
  'Fan',
  'Mow',
  'Basculin Blue-Striped Form',
  'Darmanitan Zen Mode',
]

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

function parseName(name: string): string {
  switch (name) {
    case 'Wormadam Plant Cloak':
      return 'Wormadam'
    case 'Basculin Red-Striped Form':
      return 'Basculin'
    case 'Darmanitan Standard Mode':
      return 'Darmanitan'
    default:
      return name
  }
}

;(() => {
  const pokemons: Pokemon[] = []

  fs.createReadStream('src/data/pokemon_data.csv', 'utf8')
    .pipe(
      csvParser({
        mapHeaders: ({ header }) => header.trim(),
      }),
    )
    .on('data', (row) => {
      if (
        skippedPokemons.some((name) => (row['name'] as string).startsWith(name))
      ) {
        return
      }

      const pokemon: Pokemon = {
        pokedexNumber: parseInt(row['pokedex_number']),
        name: parseName(row['name']),
        type1: row['type_1'],
        type2: row['type_2'] || null,
        eggType1: parseEggType(row['egg_type_1']),
        eggType2: parseEggType(row['egg_type_2'] || null),
        percentageMale: parseFloat(row['percentage_male']),
      }
      const fix =
        fixPokemonEggGroups[pokemon.name as keyof typeof fixPokemonEggGroups]
      if (fix) {
        pokemon.eggType1 = fix.eggType1
        pokemon.eggType2 = fix.eggType2
      }
      pokemons.push(pokemon)
    })
    .on('end', () => {
      fs.writeFileSync('public/data.json', JSON.stringify(pokemons, null, 2))
    })
})()
