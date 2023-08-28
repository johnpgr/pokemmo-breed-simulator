import pokemons from "@/data/data.json" assert { type: "json" }
import { NextResponse } from "next/server"

export function GET(_: any, { params }: { params: { name: string } }) {
  const { name } = params
  const pokemon = pokemons.find(
    (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase(),
  )
  return NextResponse.json(pokemon)
}
