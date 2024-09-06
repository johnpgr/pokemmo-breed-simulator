"use client"
import React from "react"
import { Save, SquarePen } from "lucide-react"
import type { PokemonNode } from "@/core/PokemonBreedMap"
import { BreedContext } from "@/core/PokemonBreedContext"

export function PokemonNodeNickname(props: { currentNode: PokemonNode; updateBreedTree: () => void }) {
    const ctx = React.use(BreedContext)!
    const [isEditing, setIsEditing] = React.useState(false)
    const [nickName, setNickname] = React.useState(props.currentNode.nickname ?? props.currentNode.species!.name)
    const inputRef = React.useRef<HTMLInputElement>(null)

    function update() {
        if (nickName !== props.currentNode.species?.name) {
            props.currentNode.nickname = nickName
            props.updateBreedTree()
            ctx.save()
        }
    }

    function handleEdit() {
        if (isEditing) {
            setIsEditing(false)
            update()
            return
        }
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }

    React.useEffect(() => {
        if (props.currentNode.nickname || !props.currentNode.species) return

        setNickname(props.currentNode.species.name)
    }, [props.currentNode.species])

    return (
        <div className="relative">
            <input
                ref={inputRef}
                className="focus:outline-none border-b w-full bg-transparent pb-1"
                value={nickName}
                onChange={(e) => setNickname(e.currentTarget.value)}
                disabled={!isEditing}
                maxLength={16}
            />
            <button className="absolute -right-3 scale-75 -top-1" onClick={handleEdit}>
                {isEditing ? <Save /> : <SquarePen />}
            </button>
        </div>
    )
}
