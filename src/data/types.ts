export type Pokemon = {
    name: string
    type1: PokemonType
    type2: PokemonType | null
    eggType1: string | null
    eggType2: string | null
    percentageMale: number
}

export type PokemonType =
    | 'Normal'
    | 'Fire'
    | 'Water'
    | 'Electric'
    | 'Grass'
    | 'Ice'
    | 'Fighting'
    | 'Poison'
    | 'Ground'
    | 'Flying'
    | 'Psychic'
    | 'Bug'
    | 'Rock'
    | 'Ghost'
    | 'Dragon'
    | 'Dark'
    | 'Steel'

export type EggGroup =
    | 'Monster'
    | 'Water A'
    | 'Water B'
    | 'Water C'
    | 'Bug'
    | 'Flying'
    | 'Field'
    | 'Fairy'
    | 'Plant'
    | 'Humanoid'
    | 'Mineral'
    | 'Chaos'
    | 'Ditto'
    | 'Dragon'
    | 'Cannot Breed'
    | 'Genderless'
