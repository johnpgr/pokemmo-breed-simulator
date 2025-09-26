import { assert, unreachable } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import React from "react"
import { PokemonSpecies } from "../../core/pokemon"
import type { PokemonBreedMapSerialized, ZBreedMap } from "@/core/breed-map"
import { usePokemonBreedMap } from "@/core/breed-map/hook"
import { PokemonNode } from "@/core/breed-map/node"
import {
  PokemonBreedMapPosition,
  type PokemonBreedMapPositionKey,
} from "@/core/breed-map/position"
import { BreedContext } from "./store"
import { Data } from "@/lib/data"

export function BreedContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [savedTree, setSavedTree] = useLocalStorage<ZBreedMap | undefined>(
    "last-tree",
    undefined,
  )
  const breedTree = usePokemonBreedMap()

  function serialize(): PokemonBreedMapSerialized {
    const target = breedTree.rootNode
    assert(
      target.species !== undefined,
      "Attempted to serialize target Pokemon before initializing context.",
    )
    assert(
      target.ivs !== undefined,
      "Attempted to serialize target Pokemon before initializing context.",
    )
    const serialized: PokemonBreedMapSerialized = {}
    for (const [key, node] of Object.entries(breedTree.map)) {
      serialized[key as PokemonBreedMapPositionKey] = node.serialize(
        target === node,
      )
    }

    return serialized
  }

  function deserialize(serialized: PokemonBreedMapSerialized) {
    for (const [pos, nodeRaw] of Object.entries(serialized)) {
      const key: PokemonBreedMapPositionKey =
        pos.split(",").length === 2
          ? (pos as PokemonBreedMapPositionKey)
          : unreachable("Invalid position key")

      let node = breedTree.map[key]
      if (!node) {
        node = new PokemonNode({
          position: PokemonBreedMapPosition.fromKey(key),
        })
        breedTree.map[key] = node
      }

      if (nodeRaw.id) {
        const pokeSpecies = Data.species.find((p) => p.id === nodeRaw.id)
        assert(pokeSpecies !== undefined, "Invalid pokemon id")
        const species = PokemonSpecies.parse(pokeSpecies)
        node.species = species
      }

      node.gender = nodeRaw.gender
      node.nickname = nodeRaw.nickname
      node.nature = nodeRaw.nature

      if (node.isRootNode()) {
        assert(
          nodeRaw.ivs !== undefined,
          "Deserialize failed. Root node w/ no Ivs",
        )
        node.ivs = nodeRaw.ivs
      }
    }

    breedTree.setMap({ ...breedTree.map })
  }

  function save() {
    setSavedTree(serialize())
  }

  function load() {
    if (!savedTree) return
    const rootNode = savedTree["0,0"]
    if (!rootNode) return

    deserialize(savedTree)
    breedTree.initialize()
  }

  function reset() {
    setSavedTree(undefined)
  }

  return (
    <BreedContext.Provider
      value={{
        breedTree,
        savedTree,
        serialize,
        deserialize,
        save,
        load,
        reset,
      }}
    >
      {children}
    </BreedContext.Provider>
  )
}
