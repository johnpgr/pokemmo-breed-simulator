"use client"
import React from "react"
import { Save, SquarePen } from "lucide-react"
import { useBreedContext } from "@/core/PokemonBreedContext";
import type { PokemonNode } from "@/core/PokemonBreedMap";

export function PokemonNodeNickname(props: { currentNode: PokemonNode; updateBreedTree: () => void }) {
    const ctx = useBreedContext()
    const [isEditing, setIsEditing] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    function setNickname(nick: string) {
        props.currentNode.nickname = nick
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
