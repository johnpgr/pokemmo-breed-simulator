"use client"
import React from "react";
import { Save, SquarePen } from "lucide-react";

export function PokemonNodeNickname(props: { name: string; setName: (name: string) => void }) {
    const [nickname, setNickname] = React.useState(props.name)
    const [isEditing, setIsEditing] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    function handleEditButton() {
        if (isEditing) {
            props.setName(nickname)
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
                disabled={!isEditing}
                maxLength={16}
                value={nickname}
                onChange={(e) => setNickname(e.currentTarget.value)}
            />
            <button className="absolute -right-3 scale-75 -top-1" onClick={handleEditButton}>
                {isEditing ? <Save /> : <SquarePen />}
            </button>
        </div>
    )
}

