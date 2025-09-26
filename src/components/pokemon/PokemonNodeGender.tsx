import React from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PokemonGender } from "@/core/pokemon"
import { Female } from "@/components/icons/Female"
import { Male } from "@/components/icons/Male"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "@/lib/consts"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { PokemonNode } from "@/core/node"
import { BreedContext } from "@/contexts/breed-context/store"
import { assert } from "@/lib/utils"

interface PokemonNodeGender {
  currentNode: PokemonNode
}

export const PokemonNodeGender: React.FC<PokemonNodeGender> = ({
  currentNode,
}) => {
  const ctx = React.use(BreedContext)
  const target = ctx.breedTarget
  assert(target !== undefined, "Breed target must be set")

  const gender = currentNode.gender
  const percentageMale = currentNode.species?.percentageMale
  const isLastRow = target.nature
    ? currentNode.position.row === target.ivCount
    : currentNode.position.row === target.ivCount - 1

  const canHaveGenderCost =
    !currentNode.species?.isGenderless() &&
    !currentNode.species?.isDitto() &&
    !isLastRow

  function handleToggleGenderCostIgnored() {
    currentNode.genderCostIgnored = !currentNode.genderCostIgnored
    ctx.updateBreedTree()
  }

  function handleToggleGender(value: string) {
    currentNode.gender = value as PokemonGender
    ctx.updateBreedTree()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          className="hover:bg-secondary dark:hover:bg-secondary h-8 w-8 rounded-full border p-0 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none dark:hover:ring-neutral-700 dark:focus:ring-neutral-700"
        >
          {!gender ||
          currentNode.species?.isGenderless() ||
          currentNode.species?.isDitto() ? (
            <HelpCircle size={20} />
          ) : gender === PokemonGender.Female ? (
            <Female className="h-5 w-5 fill-pink-500 antialiased" />
          ) : (
            <Male className="h-5 w-5 fill-blue-500 antialiased" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-xs">
        <div className="flex flex-col items-center gap-6">
          {currentNode.species?.isGenderless() ||
          currentNode.species?.isDitto() ? (
            <i className="text-foreground/70 text-sm">
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
                  className="hover:bg-pink-100 data-[state=on]:bg-pink-100"
                >
                  <Female className="h-6 w-6 fill-pink-500 antialiased" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Male"
                  aria-label="Toggle Male"
                  className="hover:bg-blue-100 data-[state=on]:bg-blue-100"
                >
                  <Male className="h-6 w-6 fill-blue-500 antialiased" />
                </ToggleGroupItem>
              </ToggleGroup>
              {currentNode.species ? (
                <>
                  <div
                    className={`space-y-2 ${percentageMale === 100 || percentageMale === 0 ? "opacity-50" : ""}`}
                  >
                    <i className="text-foreground/70 flex text-sm">
                      <Female className="h-4 w-4 fill-pink-500 antialiased" />:
                      {" $"}
                      {
                        GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                          (100 -
                            currentNode.species
                              .percentageMale) as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                        ]
                      }
                    </i>
                    <i className="text-foreground/70 flex text-sm">
                      <Male className="h-4 w-4 fill-blue-500 antialiased" />:
                      {" $"}
                      {
                        GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                          currentNode.species
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
                        checked={currentNode.genderCostIgnored}
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
