"use client"
import React from "react"
import { Save, SquarePen } from "lucide-react"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"

export function PokemonNodeNickname(props: { currentNode: PokemonBreedTreeNode; updateBreedTree: () => void }) {
    const ctx = useBreedTreeContext()
    const [isEditing, setIsEditing] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    function setNickname(nick: string) {
        props.currentNode.setNickname(nick)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleEditButton() {
        if (isEditing) {
            const nameInput = inputRef.current?.value
            //If the name in the input is the current node species name, it means there is no change, so don't set a nickname
            if (nameInput !== props.currentNode.species?.name) {
                setNickname(nameInput ?? "")
            }
            setIsEditing(false)
            return
        }

        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                className="focus:outline-none border-b w-full bg-transparent pb-1"
                defaultValue={props.currentNode.nickname ?? props.currentNode.species!.name}
                disabled={!isEditing}
                maxLength={16}
            />
            <button className="absolute -right-3 scale-75 -top-1" onClick={handleEditButton}>
                {isEditing ? <Save /> : <SquarePen />}
            </button>
        </div>
    )
}
