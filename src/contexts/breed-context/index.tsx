import { PokemonIvSet } from "@/core/ivset"
import { PokemonNode } from "@/core/node"
import {
  PokemonBreedMapPosition,
  type PokemonBreedMapPositionKey,
} from "@/core/position"
import { BreedErrorKind, PokemonBreeder } from "@/core/breeder"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Data } from "@/lib/data"
import { assert, unreachable } from "@/lib/utils"
import React from "react"
import { toast } from "sonner"
import { PokemonBreederKind, PokemonSpecies } from "@/core/pokemon"
import { BreedContext } from "./store"
import { LASTROW_MAPPING } from "./utils"
import type {
  BreedErrors,
  PokemonBreedMap,
  PokemonBreedMapSerialized,
  ZBreedMap,
} from "@/core/types"
import { PokemonBreedTarget } from "@/core/breed-target"

export function BreedContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [breedTarget, setBreedTarget] = React.useState<
    PokemonBreedTarget | undefined
  >()
  const [savedTree, _setSavedTree, deleteSavedTree] = useLocalStorage<
    ZBreedMap | undefined
  >("last-tree", undefined)
  const [breedErrors, _setBreedErrors] = React.useState<BreedErrors>({})
  const [breedMap, _setBreedMap] = React.useState<PokemonBreedMap>({
    "0,0": PokemonNode.ROOT({ ivs: PokemonIvSet.DEFAULT }),
  })

  function initializeBreedMap(breedTarget: PokemonBreedTarget) {
    assert(
      breedTarget.ivCount >= 2 && breedTarget.ivCount <= 5,
      "Invalid ivCount in breed target",
    )

    // Initialize root node w/ breedTarget
    const rootNode = breedMap["0,0"]
    rootNode.ivs = breedTarget.ivSet.toArray()
    rootNode.nature = breedTarget.nature
    rootNode.species = breedTarget.species

    const natured = Boolean(breedTarget.nature)
    const lastRowBreeders = LASTROW_MAPPING[breedTarget.ivCount]!
    const lastRowBreedersPositions = natured
      ? lastRowBreeders.natured
      : lastRowBreeders.natureless

    // initialize last row
    for (const [k, v] of Object.entries(lastRowBreedersPositions)) {
      switch (v) {
        case PokemonBreederKind.Nature: {
          const position = PokemonBreedMapPosition.fromKey(
            k as PokemonBreedMapPositionKey,
          )

          let node = breedMap[position.key]
          if (!node) {
            node = new PokemonNode({ position })
            breedMap[position.key] = node
          }
          node.nature = breedTarget.nature
          break
        }
        default: {
          const position = PokemonBreedMapPosition.fromKey(
            k as PokemonBreedMapPositionKey,
          )
          const ivs = breedTarget.ivSet.get(v)
          assert(ivs, "Ivs should exist for last row breeders")

          let node = breedMap[position.key]
          if (!node) {
            node = new PokemonNode({ position })
            breedMap[position.key] = node
          }
          node.ivs = [ivs]
          break
        }
      }
    }

    // initialize the rest of the tree
    // start from the second to last row
    // stops on the first row where the final pokemon node is already set
    // -1 for natured because of the way POKEMON_BREEDTREE_LASTROW_MAPPING is defined
    let row = natured ? breedTarget.ivCount - 1 : breedTarget.ivCount - 2
    while (row > 0) {
      let col = 0
      while (col < Math.pow(2, row)) {
        const position = new PokemonBreedMapPosition(row, col)
        let node = breedMap[position.key]
        if (!node) {
          node = new PokemonNode({ position })
          breedMap[position.key] = node
        }

        const parentNodes = node.getParentNodes(breedMap)
        assert(
          parentNodes,
          `Parent nodes should exist for node: ${node.position.key}`,
        )

        const p1Node = parentNodes[0]
        const p2Node = parentNodes[1]

        // calculate ivs and nature from parent nodes
        const ivs = [...new Set([...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])])]
        const nature = p1Node.nature ?? p2Node.nature ?? undefined

        node.nature = nature
        node.ivs = ivs

        col = col + 1
      }
      row = row - 1
    }
    _setBreedMap({ ...breedMap })
  }

  function computeBreedingUpdates(
    map: PokemonBreedMap,
    target: PokemonBreedTarget | undefined = breedTarget,
  ) {
    if (!target) {
      debugger
      return { updates: {}, errors: {} }
    }

    const breeder = PokemonBreeder.getInstance()
    const updates: Record<PokemonBreedMapPositionKey, PokemonNode> = {}
    const errors: BreedErrors = {}
    const lastRow = target.nature ? target.ivCount : target.ivCount - 1
    const rowLength = Math.pow(2, lastRow)

    for (let col = 0; col < rowLength; col += 2) {
      const pos = new PokemonBreedMapPosition(lastRow, col)
      let node: PokemonNode | undefined = map[pos.key]
      let partnerNode: PokemonNode | undefined = node?.getPartnerNode(map)

      const next = () => {
        node = node?.getChildNode(map)
        partnerNode = node?.getPartnerNode(map)
      }

      while (node && partnerNode) {
        const currentNodePos = node.position.key

        if (
          !node.gender ||
          !partnerNode.gender ||
          !node.species ||
          !partnerNode.species
        ) {
          next()
          continue
        }

        const childNode = node.getChildNode(map)
        if (!childNode) {
          break
        }

        const breedResult = breeder.breed(node, partnerNode, childNode)

        if (!breedResult.success) {
          if (
            breedResult.errors.length !== 1 ||
            breedResult.errors[0]!.kind !== BreedErrorKind.ChildDidNotChange
          ) {
            errors[currentNodePos] = breedResult.errors
          }
        } else {
          if (!childNode.isRootNode()) {
            const newNode = childNode.clone()
            newNode.species = breedResult.species
            newNode.gender = childNode.rollGender()
            updates[newNode.position.key] = newNode
          }
        }
        next()
      }
    }
    return { updates, errors }
  }

  function serialize(): PokemonBreedMapSerialized {
    const rootNode = breedMap["0,0"]

    assert(
      rootNode !== undefined &&
        rootNode.species !== undefined &&
        rootNode.ivs !== undefined,
      "Attempted to serialize before initializing.",
    )

    const serialized: PokemonBreedMapSerialized = {}
    for (const [key, node] of Object.entries(breedMap)) {
      serialized[key as PokemonBreedMapPositionKey] = node.serialize(
        rootNode === node,
      )
    }

    return serialized
  }

  function deserialize(serialized?: PokemonBreedMapSerialized) {
    if (!serialized || !serialized["0,0"]) return
    for (const [pos, nodeRaw] of Object.entries(serialized)) {
      const key: PokemonBreedMapPositionKey =
        pos.split(",").length === 2
          ? (pos as PokemonBreedMapPositionKey)
          : unreachable("Invalid position key")

      let node = breedMap[key]
      if (!node) {
        node = new PokemonNode({
          position: PokemonBreedMapPosition.fromKey(key),
        })
        breedMap[key] = node
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

    _setBreedMap({ ...breedMap })

    const rootNode = breedMap["0,0"]
    assert(
      rootNode !== undefined &&
        rootNode.species !== undefined &&
        rootNode.ivs !== undefined,
      "Root node should exist after deserializing",
    )

    const target = new PokemonBreedTarget(
      PokemonIvSet.fromArray(rootNode.ivs),
      rootNode.species,
      rootNode.nature,
    )
    setBreedTarget(target)
    initializeBreedMap(target)
    const { errors } = computeBreedingUpdates(breedMap, target)
    setBreedErrors(errors)
  }

  function save() {
    _setSavedTree(serialize())
  }

  function setBreedErrors(errors: BreedErrors) {
    _setBreedErrors(errors)
    // Show toast notifications for errors
    Object.entries(errors).forEach(([key, errorKind]) => {
      if (!errorKind) {
        return
      }

      const node = breedMap[key as PokemonBreedMapPositionKey]
      if (!node?.species) {
        return
      }

      const partner = node.getPartnerNode(breedMap)
      if (!partner?.species) {
        return
      }

      let errorMsg = ""
      for (const error of errorKind.values()) {
        if (error.kind === BreedErrorKind.ChildDidNotChange) {
          continue
        }
        errorMsg += error.kind
        errorMsg += ", "
      }

      if (errorMsg.endsWith(", ")) {
        errorMsg = errorMsg.slice(0, -2)
      }

      if (errorMsg) {
        // bullshit-ass hack to make this toast show up when deserializing
        setTimeout(
          () =>
            toast.error(
              `${node!.species!.name} cannot breed with ${partner!.species!.name}.`,
              {
                description: `Error codes: ${errorMsg}`,
                action: {
                  label: "Dismiss",
                  onClick: () => {},
                },
              },
            ),
          0,
        )
      }
    })
  }

  function updateBreedTree({
    compute = true,
    persist = true,
    map = breedMap,
  }: {
    compute?: boolean
    persist?: boolean
    map?: PokemonBreedMap
  } = {}) {
    if (compute) {
      const { updates, errors } = computeBreedingUpdates(breedMap)
      _setBreedMap({ ...map, ...updates })
      setBreedErrors(errors)
    } else {
      _setBreedMap({ ...map })
    }

    if (persist) {
      save()
    }
  }

  function reset() {
    deleteSavedTree()
    setBreedTarget(undefined)
    updateBreedTree({
      compute: false,
      persist: false,
      map: { "0,0": PokemonNode.ROOT({ ivs: PokemonIvSet.DEFAULT }) },
    })
  }

  React.useEffect(() => {
    ;(() => {
      deserialize(savedTree)
    })()
  }, [savedTree])

  return (
    <BreedContext.Provider
      value={{
        breedTarget,
        setBreedTarget,
        breedErrors,
        setBreedErrors,
        breedMap,
        initializeBreedMap,
        updateBreedTree,
        savedTree,
        serialize,
        deserialize,
        reset,
      }}
    >
      {children}
    </BreedContext.Provider>
  )
}
