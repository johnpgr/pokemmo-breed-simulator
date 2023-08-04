import { raise } from '@/lib/utils'
import { BreedNode, Position } from './types'

type BreedPokemonNode = {
  position: Position
  breedNode: NonNullable<BreedNode>
}

export class Breeder {
  constructor(
    private poke1: BreedPokemonNode,
    private poke2: BreedPokemonNode,
  ) {}

  public breed() {
    const compatible = this.checkBreedability()
    if (!compatible) {
      this.breedError(this.poke1.position, this.poke2.position)
    }

    const child = this.getBreedChildSpecies()
    return child
  }
  private checkBreedability() {
    const genderCompatible = this.genderCompatibility()
    const eggTypeCompatible = this.eggTypeCompatibility()

    if (!genderCompatible || !eggTypeCompatible) {
      return false
    }
    return true
  }
  private eggTypeCompatibility() {
    const compatible = this.poke1.breedNode.pokemon.eggTypes.some((e) =>
      this.poke2.breedNode.pokemon.eggTypes.includes(e),
    )

    return compatible
  }
  private genderCompatibility() {
    if (this.poke1.breedNode.gender === this.poke2.breedNode.gender) {
      return false
    }
    return true
  }
  private getBreedChildSpecies() {
    const pokes = [this.poke1.breedNode, this.poke2.breedNode].filter(
      (p) => p.gender === 'Female',
    )
    if (pokes.length !== 1) {
      raise('This shouldn not happen')
    }
    return pokes[0].pokemon
  }
  private breedError(pos1: Position, pos2: Position): never {
    raise('Not implemented.')
  }
}
