import React from "react"
import { Save, SquarePen } from "lucide-react"
import type { PokemonNode } from "@/core/breed-map/node"
import { BreedContext } from "@/contexts/breed-context/store"

export function PokemonNodeNickname(props: {
  currentNode: PokemonNode
  updateBreedTree: () => void
}) {
  const ctx = React.use(BreedContext)
  const [isEditing, setIsEditing] = React.useState(false)
  const [nickName, setNickname] = React.useState(
    props.currentNode.nickname ?? props.currentNode.species?.name ?? "",
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  function saveNicknameIfChanged() {
    if (nickName !== props.currentNode.species?.name) {
      props.currentNode.nickname = nickName
      props.updateBreedTree()
      ctx.save()
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
