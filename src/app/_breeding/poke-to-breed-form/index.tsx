'use client'

import { Button } from '@/app/_components/ui/button'
import { usePokemonToBreed } from '@/app/_context/hooks'
import { IVs } from '@/app/_context/types'
import { NatureType, Pokemon } from '@/data/types'
import { Keys, getPokemonByName } from '@/lib/utils'
import React from 'react'
import { Ivs } from './ivs'
import { Species } from './species'
import { NatureSelect } from './nature'

export const PokemonToBreedSelector = (props: {
  pokemons: {
    name: string
    number: number
  }[]
}) => {
  const ctx = usePokemonToBreed()
  const [isSpeciesSelectOpen, setIsSpeciesSelectOpen] = React.useState(false)
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null)
  const [ivs, setIvs] = React.useState<IVs>({
    hp: null,
    attack: null,
    defense: null,
    specialAttack: null,
    specialDefense: null,
    speed: null,
  })
  const [natured, setNatured] = React.useState(false)
  const [nature, setNature] = React.useState<NatureType | null>(null)

  async function handleSelectPokemon(name: string) {
    const pokemon = await getPokemonByName(name)
    setPokemon(pokemon)
    setIsSpeciesSelectOpen(false)
  }

  const handleSelectIvs = React.useCallback((iv: Keys<IVs>) => {
    setIvs((prev) => {
      return {
        ...prev,
        [iv]: 31,
      } as IVs
    })
  }, [])

  function handleSubmit() {
    ctx.setPokemon(pokemon)
    ctx.setIvs(ivs)
    ctx.setNature(nature)
  }

  return (
    <form className="container max-w-6xl mx-auto flex flex-col items-center gap-4">
      Select a pokemon to breed
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <Species
            pokemons={props.pokemons}
            isOpen={isSpeciesSelectOpen}
            setIsOpen={setIsSpeciesSelectOpen}
            selected={pokemon?.name}
            onSelect={handleSelectPokemon}
          />
          <NatureSelect
            checked={natured}
            onCheckedChange={setNatured}
            nature={nature}
            setNature={setNature}
          />
          <Ivs natured={natured} onChange={handleSelectIvs} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit">Start Breeding</Button>
        <Button type="reset" variant={'destructive'}>
          Clear
        </Button>
      </div>
    </form>
  )
}