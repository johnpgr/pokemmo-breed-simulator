"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PokemonGender, PokemonIv } from "@/core/pokemon"
import type { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import type { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { getEvItemSpriteUrl, getPokemonSpriteUrl } from "@/lib/sprites"
import {
    Strings,
    run,
} from "@/lib/utils"
import { HelpCircle, Save, SquarePen } from "lucide-react"
import React from "react"
import { GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "./consts"
import { Button } from "./ui/button"
import { Female } from "./ui/icons/Female"
import { Male } from "./ui/icons/Male"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip"

export function PokemonNodeInfo(props: {
    currentNode: PokemonBreedTreeNode
    breedTree: PokemonBreedTreeMap
    setBreedTree: React.Dispatch<React.SetStateAction<PokemonBreedTreeMap>>
    setGender: (gender?: PokemonGender) => void
}) {
    const name =
        props.currentNode?.nickname ?? props.currentNode?.species?.name ?? ""
    const heldItem = run((): HeldItem | null => {
        const breedPartner = props.currentNode.getPartnerNode(props.breedTree)

        if (!breedPartner) {
            return null
        }

        const ivThatDoesntExistOnBreedPartner =
            props.currentNode.ivs?.filter(
                (iv) => !breedPartner.ivs?.includes(iv),
            ) ?? []
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
    })

    function setNickname(nick: string) {
        props.currentNode.nickname = nick
        props.setBreedTree((prev) => ({
            ...prev,
        }))
    }

    function resetNode() {
        props.setGender(undefined)
        props.currentNode.species = undefined

        props.setBreedTree((prev) => ({
            ...prev,
        }))
    }

    return (
        <Card className="w-full max-w-64 ml-4 h-fit relative">
            <CardHeader>
                <CardTitle className="flex items-center">
                    {props.currentNode && props.currentNode.species ? (
                        <div className="flex items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getPokemonSpriteUrl(
                                    props.currentNode.species.name,
                                )}
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={props.currentNode.species.name}
                                className="mb-1"
                            />
                            <PokemonNodeNickname
                                name={name}
                                setName={setNickname}
                            />
                        </div>
                    ) : null}
                </CardTitle>
                {!props.currentNode.isRootNode() ? (
                    <div className="absolute -top-4 -left-3 flex flex-col-reverse gap-1 items-center">
                        <PokemonNodeGenderButton
                            currentNode={props.currentNode}
                            breedTree={props.breedTree}
                            setBreedTree={props.setBreedTree}
                            setGender={props.setGender}
                        />
                        <PokemonNodeHeldItemIcon
                            item={
                                //if not natured, ivs must exist.
                                props.currentNode.nature
                                    ? HeldItem.Nature
                                    : heldItem!
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
                        <span className="text-sm">
                            {props.currentNode.nature}
                        </span>
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
                            <Button
                                onClick={resetNode}
                                className="mt-2"
                                variant={"destructive"}
                                size={"sm"}
                            >
                                Reset
                            </Button>
                        ) : null}
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}

export function PokemonNodeGenderButton(props: {
    currentNode: PokemonBreedTreeNode
    breedTree: PokemonBreedTreeMap
    setBreedTree: React.Dispatch<React.SetStateAction<PokemonBreedTreeMap>>
    setGender: (gender: PokemonGender) => void
}) {
    const gender = props.currentNode.gender
    const percentageMale = props.currentNode.species?.percentageMale

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className="rounded-full border p-[6px] h-fit w-fit"
                >
                    {!gender ||
                        props.currentNode.isGenderless() ||
                        props.currentNode.isDitto() ? (
                        <HelpCircle size={20} />
                    ) : gender === PokemonGender.Female ? (
                        <Female className="h-5 w-5 fill-pink-500 antialiased" />
                    ) : (
                        <Male className="h-5 w-5 fill-blue-500 antialiased" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-xs w-full">
                <div className="flex flex-col items-center gap-6">
                    {props.currentNode.isGenderless() ||
                        props.currentNode.isDitto() ? (
                        <i className="text-sm text-foreground/70">
                            This Pokemon species can&apos;t have a gender
                        </i>
                    ) : (
                        <>
                            <ToggleGroup
                                type="single"
                                value={gender}
                                disabled={
                                    percentageMale === 100 ||
                                    percentageMale === 0
                                }
                                onValueChange={(value) =>
                                    props.setGender(value as PokemonGender)
                                }
                            >
                                <ToggleGroupItem
                                    value="Female"
                                    aria-label="Toggle Female"
                                    className="data-[state=on]:bg-pink-100 hover:bg-pink-100"
                                >
                                    <Female className="h-6 w-6 fill-pink-500 antialiased" />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="Male"
                                    aria-label="Toggle Male"
                                    className="data-[state=on]:bg-blue-100 hover:bg-blue-100"
                                >
                                    <Male className="fill-blue-500 h-6 w-6 antialiased" />
                                </ToggleGroupItem>
                            </ToggleGroup>
                            {props.currentNode.species ? (
                                <div
                                    className={`space-y-2 ${percentageMale === 100 || percentageMale === 0 ? "opacity-50" : ""}`}
                                >
                                    <i className="text-sm text-foreground/70 flex">
                                        <Female className="h-4 w-4 fill-pink-500 antialiased" />
                                        :{" $"}
                                        {
                                            GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                                            (100 -
                                                props.currentNode.species
                                                    .percentageMale) as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                                            ]
                                        }
                                    </i>
                                    <i className="text-sm text-foreground/70 flex">
                                        <Male className="fill-blue-500 h-4 w-4 antialiased" />
                                        :{" $"}
                                        {
                                            GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                                            props.currentNode.species
                                                .percentageMale as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                                            ]
                                        }
                                    </i>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

function PokemonNodeNickname(props: {
    name: string
    setName: (name: string) => void
}) {
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
            <button
                className="absolute -right-3 scale-75 -top-1"
                onClick={handleEditButton}
            >
                {isEditing ? <Save /> : <SquarePen />}
            </button>
        </div>
    )
}


export enum HeldItem {
    HP = "power-weight",
    Attack = "power-bracer",
    Defense = "power-belt",
    SpecialAttack = "power-lens",
    SpecialDefense = "power-band",
    Speed = "power-anklet",
    Nature = "everstone",
}

function PokemonNodeHeldItemIcon(props: { item: HeldItem }) {
    return (
        <TooltipProvider delayDuration={250}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="w-fit h-fit p-0 rounded-full"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getEvItemSpriteUrl(props.item)}
                            alt={`Held item: ${props.item}`}
                            style={{
                                imageRendering: "pixelated",
                            }}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{Strings.kebabToSpacedPascal(props.item)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
