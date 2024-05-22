"use client"
import { HelpCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { PokemonGender } from "@/core/pokemon"
import { Female } from "./ui/icons/Female"
import { Male } from "./ui/icons/Male"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "./consts"
import { PokemonBreedTreeNode } from "@/core/tree/BreedTreeNode"
import { PokemonBreedTreeMap } from "@/core/tree/useBreedTreeMap"
import { Checkbox } from "./ui/checkbox"
import { useBreedTreeContext } from "@/core/ctx/PokemonBreedTreeContext"
import { Label } from "./ui/label"

export function PokemonNodeGender(props: {
    desired31IvCount: number
    currentNode: PokemonBreedTreeNode
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
}) {
    const ctx = useBreedTreeContext()
    const gender = props.currentNode.gender
    const percentageMale = props.currentNode.species?.percentageMale
    const isLastRow = ctx.breedTarget.nature
        ? props.currentNode.position.row === props.desired31IvCount
        : props.currentNode.position.row === props.desired31IvCount - 1
    const canHaveGenderCost = !props.currentNode.isGenderless() && !props.currentNode.isDitto() && !isLastRow

    function handleToggleGenderCostIgnored() {
        props.currentNode.setGenderCostIgnored(!props.currentNode.genderCostIgnored)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleToggleGender(value: string) {
        props.currentNode.setGender(value as PokemonGender)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className="rounded-full border p-[6px] h-fit w-fit">
                    {!gender || props.currentNode.isGenderless() || props.currentNode.isDitto() ? (
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
                    {props.currentNode.isGenderless() || props.currentNode.isDitto() ? (
                        <i className="text-sm text-foreground/70">This Pokemon species can&apos;t have a gender</i>
                    ) : (
                        <>
                            <ToggleGroup
                                type="single"
                                value={gender}
                                disabled={percentageMale === 100 || percentageMale === 0}
                                onValueChange={handleToggleGender}
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
                                <>
                                    <div
                                        className={`space-y-2 ${percentageMale === 100 || percentageMale === 0 ? "opacity-50" : ""}`}
                                    >
                                        <i className="text-sm text-foreground/70 flex">
                                            <Female className="h-4 w-4 fill-pink-500 antialiased" />:{" $"}
                                            {
                                                GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                                                    (100 -
                                                        props.currentNode.species
                                                            .percentageMale) as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                                                ]
                                            }
                                        </i>
                                        <i className="text-sm text-foreground/70 flex">
                                            <Male className="fill-blue-500 h-4 w-4 antialiased" />:{" $"}
                                            {
                                                GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                                                    props.currentNode.species
                                                        .percentageMale as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                                                ]
                                            }
                                        </i>
                                    </div>
                                    {canHaveGenderCost ? (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                className="border-foreground/50"
                                                id="ignore-g"
                                                checked={props.currentNode.genderCostIgnored}
                                                onCheckedChange={handleToggleGenderCostIgnored}
                                            />
                                            <Label htmlFor="ignore-g" className="text-foreground/70">
                                                Ignore cost
                                            </Label>
                                        </div>
                                    ) : null}
                                </>
                            ) : null}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
