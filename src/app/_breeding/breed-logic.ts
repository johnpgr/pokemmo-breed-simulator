import { raise } from '@/lib/utils'
import { BreedNode, Position } from './types'

function breedError(pos1: Position, pos2: Position): never {
  raise('Not implemented.')
}

function getBreedChildSpecies(poke1: BreedNode, poke2: BreedNode) {
  const pokes = [poke1, poke2].filter((p) => p.gender === 'Female')
  if (pokes.length !== 1) {
    raise('This shouldn not happen')
  }
  return pokes[0].pokemon
}

function genderCompatibility(poke1: BreedNode, poke2: BreedNode) {
  if (poke1.gender === poke2.gender) {
    return false
  }
  return true
}

function eggTypeCompatibility(
  { pokemon: poke1 }: BreedNode,
  { pokemon: poke2 }: BreedNode,
) {
  const compatible = poke1.eggTypes.some((e) => poke2.eggTypes.includes(e))

  return compatible
}

function checkBreedability(poke1: BreedNode, poke2: BreedNode) {
  const genderCompatible = genderCompatibility(poke1, poke2)
  const eggTypeCompatible = eggTypeCompatibility(poke1, poke2)

  if (!genderCompatible || !eggTypeCompatible) {
    return false
  }
  return true
}

export function breed(
  poke1: { position: Position; breed: BreedNode },
  poke2: { position: Position; breed: BreedNode },
) {
  const compatible = checkBreedability(poke1.breed, poke2.breed)
  if (!compatible) {
    breedError(poke1.position, poke2.position)
  }

  const child = getBreedChildSpecies(poke1.breed, poke2.breed)
  return child
}
