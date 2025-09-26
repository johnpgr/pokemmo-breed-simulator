import React from "react"
import type { BreedContext as IBreedContext } from "./types"

export const BreedContext = React.createContext<IBreedContext>(
  {} as IBreedContext,
)
