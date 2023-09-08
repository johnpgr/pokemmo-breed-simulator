"use client"
import React, { useCallback } from "react"
import { BreedError, BreedNodeAndPosition } from "./breeder"
import { GenderType } from "./types"

export type BreedRequestFn = (
  pokemon: BreedNodeAndPosition,
  partner: BreedNodeAndPosition,
  callback: (
    pokemon: BreedNodeAndPosition,
    partner: BreedNodeAndPosition,
    childGender: GenderType,
  ) => void | BreedError,
) => void | BreedError

export function useBreedRequester() {
  const [isRequesting, setIsRequesting] = React.useState(false)

  //TODO: Implement
  const breedRequest: BreedRequestFn = useCallback((pokemon, partner, callback) => {
    setIsRequesting(true)
  }, [])

  return {
    breedRequest,
    isRequesting,
  }
}
