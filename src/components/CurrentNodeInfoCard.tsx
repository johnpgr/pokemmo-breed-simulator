"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pascalToSpacedPascal, getPokemonSpriteUrl, randomString } from "@/lib/utils"
import { HelpCircle, Save, SquarePen } from "lucide-react"
import { HeldItem, HeldItemsView } from "./HeldItemView"
import type { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { assert } from "@/lib/assert"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { PokemonGender, PokemonIv } from "@/core/pokemon"

//TODO: Improve the UI on this.
export function CurrentNodeInfoCard(props: {
    currentNode: PokemonBreedTreeNode
    breedTree: PokemonBreedTreeMap
    setBreedTree: React.Dispatch<React.SetStateAction<PokemonBreedTreeMap>>
    setGender: (gender: PokemonGender) => void
}) {
    function getHeldItem(): HeldItem | null {
        const breedPartner = props.currentNode.getPartnerNode(props.breedTree)

        if (!breedPartner) {
            return null
        }

        const ivThatDoesntExistOnBreedPartner = props.currentNode.ivs?.filter((iv) => !breedPartner.ivs?.includes(iv)) ?? []
        if (ivThatDoesntExistOnBreedPartner.length === 0) {
            return null
        }

        switch (ivThatDoesntExistOnBreedPartner[0]) {
            case PokemonIv.HP:
                return HeldItem.HP
            case PokemonIv.Attack:
                return HeldItem.Attack
            case PokemonIv.Defense:
                return HeldItem.Defense
            case PokemonIv.SpecialAttack:
                return HeldItem.SpecialAttack
            case PokemonIv.SpecialDefense:
                return HeldItem.SpecialDefense
            case PokemonIv.Speed:
                return HeldItem.Speed
            default:
                return null
        }
    }

    function setNickname(nick: string) {
        props.currentNode.nickname = nick
        props.setBreedTree((prev) => ({
            ...prev,
        }))
    }

    const name = props.currentNode?.nickname ?? props.currentNode?.species?.name ?? ""
    const heldItem = getHeldItem()

    return (
        <Card className="w-fit h-fit relative">
            <CardHeader className="">
                <HeldItemsView
                    item={
                        //if not natured, ivs must exist.
                        props.currentNode.nature ? HeldItem.Nature : heldItem!
                    }
                />
                <CardTitle className="flex items-center">
                    {props.currentNode && props.currentNode.species ? (
                        <div className="flex gap-2 items-center">
                            <img
                                src={getPokemonSpriteUrl(props.currentNode.species.name)}
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={props.currentNode.species.name}
                                className="mb-1"
                            />
                            <CurrentNodeName name={name} setName={setNickname} />
                        </div>
                    ) : (
                        <HelpCircle size={32} />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
                <div className="flex flex-col gap-1">
                    {Boolean(props.currentNode.ivs) ? <p>Ivs:</p> : null}
                    {props.currentNode.ivs?.map((iv) => (
                        <span key={randomString(4)}>31 {pascalToSpacedPascal(iv)}</span>
                    ))}
                </div>
                {props.currentNode.nature && <i className="block">{props.currentNode.nature}</i>}
                {props.currentNode.species ? (
                    <React.Fragment>
                        <div className="flex flex-col gap-1">
                            <p>Egg Groups:</p>
                            {props.currentNode.species.eggGroups.map((egg) => (
                                <span key={randomString(3)}>{egg}</span>
                            ))}
                        </div>
                    </React.Fragment>
                ) : null}
            </CardContent>
        </Card>
    )
}

function CurrentNodeName(props: { name: string; setName: (name: string) => void }) {
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
                className="focus:outline-none border-b w-full disabled:bg-transparent pb-1"
                disabled={!isEditing}
                maxLength={16}
                value={nickname}
                onChange={(e) => setNickname(e.currentTarget.value)}
            />
            <button className="absolute -right-3 scale-75" onClick={handleEditButton}>
                {isEditing ? <Save /> : <SquarePen />}
            </button>
        </div>
    )
}
