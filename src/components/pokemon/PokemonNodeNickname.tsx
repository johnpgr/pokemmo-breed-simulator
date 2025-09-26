import React from "react"
import { Save, SquarePen } from "lucide-react"
import type { PokemonNode } from "@/core/node"
import { BreedContext } from "@/contexts/breed-context/store"

interface PokemonNodeNicknameProps {
  currentNode: PokemonNode
}

export const PokemonNodeNickname: React.FC<PokemonNodeNicknameProps> = ({
  currentNode,
}) => {
  const ctx = React.use(BreedContext)
  const [isEditing, setIsEditing] = React.useState(false)
  const [nickName, setNickname] = React.useState(
    currentNode.nickname ?? currentNode.species?.name ?? "",
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  function saveNicknameIfChanged() {
    if (nickName !== currentNode.species?.name) {
      currentNode.nickname = nickName
      ctx.updateBreedTree({ runLogic: false })
    }
  }

  function handleEdit() {
    if (isEditing) {
      setIsEditing(false)
      saveNicknameIfChanged()
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
        className="w-full border-b bg-transparent pb-1 focus:outline-none"
        value={nickName}
        onChange={(e) => setNickname(e.currentTarget.value)}
        disabled={!isEditing}
        maxLength={16}
      />
      <button
        className="absolute -top-1 -right-3 scale-75"
        onClick={handleEdit}
      >
        {isEditing ? <Save /> : <SquarePen />}
      </button>
    </div>
  )
}
