import React from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PokemonGender } from "@/core/pokemon"
import { Female } from "@/components/icons/Female"
import { Male } from "@/components/icons/Male"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "@/lib/consts"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { PokemonNode } from "@/core/breed-map/node"
import type { PokemonBreedMap } from "@/core/breed-map"
import { BreedContext } from "@/contexts/breed-context/store"

export function PokemonNodeGender(props: {
  desired31IvCount: number
  currentNode: PokemonNode
  breedTree: PokemonBreedMap
  updateBreedTree: () => void
}) {
  const ctx = React.use(BreedContext)
  const gender = props.currentNode.gender
  const percentageMale = props.currentNode.species?.percentageMale
  const isLastRow = ctx.breedTree.rootNode.nature
    ? props.currentNode.position.row === props.desired31IvCount
    : props.currentNode.position.row === props.desired31IvCount - 1
  const canHaveGenderCost =
    !props.currentNode.species?.isGenderless() &&
    !props.currentNode.species?.isDitto() &&
    !isLastRow

  function handleToggleGenderCostIgnored() {
    props.currentNode.genderCostIgnored = !props.currentNode.genderCostIgnored
    props.updateBreedTree()
    ctx.save()
  }

  function handleToggleGender(value: string) {
    props.currentNode.gender = value as PokemonGender
    props.updateBreedTree()
    ctx.save()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          className="h-8 w-8 rounded-full p-0 border hover:bg-secondary dark:hover:bg-secondary hover:ring-2 hover:ring-offset-2 hover:ring-neutral-400 dark:hover:ring-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 dark:focus:ring-neutral-700"
        >
          {!gender ||
          props.currentNode.species?.isGenderless() ||
          props.currentNode.species?.isDitto() ? (
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
          {props.currentNode.species?.isGenderless() ||
          props.currentNode.species?.isDitto() ? (
            <i className="text-sm text-foreground/70">
              This Pokemon species can&apos;t have a gender
            </i>
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
                      <Female className="h-4 w-4 fill-pink-500 antialiased" />:
                      {" $"}
                      {
                        GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                          (100 -
                            props.currentNode.species
                              .percentageMale) as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                        ]
                      }
                    </i>
                    <i className="text-sm text-foreground/70 flex">
                      <Male className="fill-blue-500 h-4 w-4 antialiased" />:
                      {" $"}
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
