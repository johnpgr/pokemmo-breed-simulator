import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PokemonNature, PokemonIv } from "@/core/pokemon"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"
import { cn } from "@/lib/utils"

const ivLabel: Record<PokemonIv, string> = {
  Hp: "HP",
  Attack: "ATK",
  Defense: "DEF",
  SpecialAttack: "SP.ATK",
  SpecialDefense: "SP.DEF",
  Speed: "SPD",
}

const NATURE_EFFECT: Record<
  PokemonNature,
  { up?: PokemonIv | undefined; down?: PokemonIv | undefined }
> = {
  Hardy: { up: undefined, down: undefined },
  Lonely: { up: PokemonIv.Attack, down: PokemonIv.Defense },
  Brave: { up: PokemonIv.Attack, down: PokemonIv.Speed },
  Adamant: { up: PokemonIv.Attack, down: PokemonIv.SpecialAttack },
  Naughty: { up: PokemonIv.Attack, down: PokemonIv.SpecialDefense },
  Bold: { up: PokemonIv.Defense, down: PokemonIv.Attack },
  Docile: { up: undefined, down: undefined },
  Relaxed: { up: PokemonIv.Defense, down: PokemonIv.Speed },
  Impish: { up: PokemonIv.Defense, down: PokemonIv.SpecialAttack },
  Lax: { up: PokemonIv.Defense, down: PokemonIv.SpecialDefense },
  Timid: { up: PokemonIv.Speed, down: PokemonIv.Attack },
  Hasty: { up: PokemonIv.Speed, down: PokemonIv.Defense },
  Serious: { up: undefined, down: undefined },
  Jolly: { up: PokemonIv.Speed, down: PokemonIv.SpecialAttack },
  Naive: { up: PokemonIv.Speed, down: PokemonIv.SpecialDefense },
  Modest: { up: PokemonIv.SpecialAttack, down: PokemonIv.Attack },
  Mild: { up: PokemonIv.SpecialAttack, down: PokemonIv.Defense },
  Quiet: { up: PokemonIv.SpecialAttack, down: PokemonIv.Speed },
  Bashful: { up: undefined, down: undefined },
  Rash: { up: PokemonIv.SpecialAttack, down: PokemonIv.SpecialDefense },
  Calm: { up: PokemonIv.SpecialDefense, down: PokemonIv.Attack },
  Gentle: { up: PokemonIv.SpecialDefense, down: PokemonIv.Defense },
  Sassy: { up: PokemonIv.SpecialDefense, down: PokemonIv.Speed },
  Careful: { up: PokemonIv.SpecialDefense, down: PokemonIv.SpecialAttack },
  Quirky: { up: undefined, down: undefined },
}

export function PokemonNatureSelect(props: {
  currentPokemonInSelect: PokemonNodeInSelect
  setCurrentPokemonInSelect: React.Dispatch<
    React.SetStateAction<PokemonNodeInSelect>
  >
}) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const natured = Boolean(props.currentPokemonInSelect.nature)
  const currentSelectedNature = props.currentPokemonInSelect.nature
  const natures = React.useMemo(() => Object.values(PokemonNature), [])

  function handleNatureSelect(value?: PokemonNature) {
    props.setCurrentPokemonInSelect((prev) => ({ ...prev, nature: value }))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {natured ? currentSelectedNature : "Select a nature"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput
            placeholder="Search nature..."
            value={search}
            onValueChange={setSearch}
            data-cy="search-nature-input"
          />
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-72">
              <CommandItem
                onSelect={() => {
                  handleNatureSelect(undefined)
                }}
                className="relative gap-2"
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    !natured ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex items-center justify-between">
                  <span>No nature</span>
                </div>
              </CommandItem>
              {natures.map((nature) => (
                <React.Fragment key={`PokemonNatureSelect:${nature}`}>
                  <CommandItem
                    value={nature}
                    onSelect={() => {
                      handleNatureSelect(nature)
                    }}
                    data-cy={`${nature}-value`}
                    className="relative"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        currentSelectedNature === nature
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex w-full items-center justify-between">
                      <span>{nature}</span>
                      <span className="ml-2 text-xs">
                        {NATURE_EFFECT[nature].up ? (
                          <span className="mr-1 text-green-600">
                            +{ivLabel[NATURE_EFFECT[nature].up!]}
                          </span>
                        ) : null}
                        {NATURE_EFFECT[nature].down ? (
                          <span className="text-destructive">
                            -{ivLabel[NATURE_EFFECT[nature].down!]}
                          </span>
                        ) : null}
                        {!NATURE_EFFECT[nature].up &&
                        !NATURE_EFFECT[nature].down ? (
                          <span className="text-foreground/70">NEUTRAL</span>
                        ) : null}
                      </span>
                    </div>
                  </CommandItem>
                </React.Fragment>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
