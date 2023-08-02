import { Pokemon } from '@/data/types'
import { getSprite } from '@/lib/utils'

export const PokemonCard = (props: { pokemon: Pokemon }) => {
  return (
    <div>
      <h1>{props.pokemon.name}</h1>
      <h2>{props.pokemon.type1}</h2>
      <h2>{props.pokemon.type2}</h2>
      <h2>{props.pokemon.eggType1}</h2>
      <h2>{props.pokemon.eggType2}</h2>
      <h2>{props.pokemon.pokedexNumber}</h2>
      <h2>{props.pokemon.percentageMale}</h2>
      <img
        src={getSprite(props.pokemon.pokedexNumber)}
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
