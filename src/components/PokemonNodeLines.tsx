"use client"
import type { PokemonBreedTreePosition } from "@/core/tree/BreedTreePosition"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { assert } from "@/lib/assert"
import React from "react"
import { BreedErrors } from "./PokemonBreedTree"

enum LineDirection {
    Left,
    Right,
}

export function PokemonNodeLines(props: {
    position: PokemonBreedTreePosition
    rowLength: number
    breedTree: PokemonBreedTreeMap
    breedErrors: BreedErrors
    children: React.ReactNode
}) {
    const size = 100 / props.rowLength

    const node = props.breedTree[props.position.key()]
    assert.exists(node, "Node exists")

    const partnerNode = node.getPartnerNode(props.breedTree)

    // Root node
    if (!partnerNode) {
        return (
            <div
                style={{ flexBasis: `${size}%` }}
                className="flex items-center justify-center relative"
            >
                {props.children}
            </div>
        )
    }

    const lineDirection =
        partnerNode.position.col > node.position.col
            ? LineDirection.Left
            : LineDirection.Right
    const hasError =
        props.breedErrors[node.position.key()] ||
        props.breedErrors[partnerNode.position.key()]
    const color = hasError ? "bg-red-500" : "bg-foreground/70"

    return (
        <div
            style={{ flexBasis: `${size}%` }}
            className="flex items-center justify-center relative"
        >
            {props.children}
            <div
                className={`absolute w-1/2 h-[1px] ${color} ${lineDirection === LineDirection.Left ? "translate-x-1/2" : "-translate-x-1/2"}`}
            ></div>
            {lineDirection === LineDirection.Left ? (
                <div
                    className={`absolute h-16 w-[1px] ${color} left-full -bottom-[45px]`}
                ></div>
            ) : null}
        </div>
    )
}
