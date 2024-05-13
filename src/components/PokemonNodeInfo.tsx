"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import { PokemonGender } from "@/core/pokemon"
import type { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { getPokemonSpriteUrl } from "@/lib/sprites"
import { Strings } from "@/lib/utils"
import { HeldItem, PokemonNodeHeldItem, getHeldItemForNode } from "./PokemonNodeHeldItem"
import { Button } from "./ui/button"
import { PokemonNodeGender } from "./PokemonNodeGender"
import { PokemonNodeNickname } from "./PokemonNodeNickname"

export function PokemonNodeInfo(props: {
    currentNode: PokemonBreedTreeNode
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
    setGender: (gender?: PokemonGender) => void
}) {
    const ctx = useBreedTreeContext()
    const name = props.currentNode?.nickname ?? props.currentNode?.species?.name ?? ""
    const heldItem = getHeldItemForNode(props.currentNode, props.breedTree)

    function setNickname(nick: string) {
        props.currentNode.setNickname(nick)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function resetNode() {
        props.setGender(undefined)
        props.currentNode.setSpecies(undefined)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    return (
        <Card className="w-full md:max-w-64 md:ml-4 h-fit relative">
            <CardHeader>
                <CardTitle className="flex items-center">
                    {props.currentNode && props.currentNode.species ? (
                        <div className="flex items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getPokemonSpriteUrl(props.currentNode.species.name)}
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={props.currentNode.species.name}
                                className="mb-1"
                            />
                            <PokemonNodeNickname name={name} setName={setNickname} />
                        </div>
                    ) : null}
                </CardTitle>
                {!props.currentNode.isRootNode() ? (
                    <div className="absolute -top-4 -left-3 flex flex-col-reverse gap-1 items-center">
                        <PokemonNodeGender
                            currentNode={props.currentNode}
                            breedTree={props.breedTree}
                            updateBreedTree={props.updateBreedTree}
                            setGender={props.setGender}
                        />
                        <PokemonNodeHeldItem
                            item={
                                //if not natured, ivs must exist.
                                props.currentNode.nature ? HeldItem.Nature : heldItem!
                            }
                        />
                    </div>
                ) : null}
            </CardHeader>
            <CardContent className="gap-1 flex flex-col pl-9">
                {props.currentNode.ivs ? (
                    <>
                        <p className="font-bold -mb-1">Ivs</p>
                        {props.currentNode.ivs.map((iv) => (
                            <span className="text-sm" key={Strings.random(4)}>
                                31 {Strings.pascalToSpacedPascal(iv)}
                            </span>
                        ))}
                    </>
                ) : null}
                {props.currentNode.nature ? (
                    <>
                        <p className="font-bold -mb-1">Nature</p>
                        <span className="text-sm">{props.currentNode.nature}</span>
                    </>
                ) : null}
                {props.currentNode.species ? (
                    <>
                        <p className="font-bold -mb-1">Egg Groups</p>
                        <p>
                            <span className="text-sm">
                                {props.currentNode.species!.eggGroups[0]}
                                {props.currentNode.species?.eggGroups[1]
                                    ? `, ${props.currentNode.species.eggGroups[1]}`
                                    : null}
                            </span>
                        </p>
                        {!props.currentNode.isRootNode() ? (
                            <Button onClick={resetNode} className="mt-2" variant={"destructive"} size={"sm"}>
                                Reset
                            </Button>
                        ) : null}
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
