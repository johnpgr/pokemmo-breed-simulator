import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandGroup, CommandEmpty, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { NatureType, Nature } from "@/data/types"
import { capitalize, randomString } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"

export function NatureSelect({
  nature,
  setNature,
  checked,
  onCheckedChange,
}: {
  nature: NatureType | null
  setNature: React.Dispatch<React.SetStateAction<NatureType | null>>
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const [search, setSearch] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <Switch id="natured-switch" checked={checked} onCheckedChange={onCheckedChange} />
        Natured?
      </div>
      {checked && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} className="border">
              {nature ?? "Select a nature"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
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
                  {Object.keys(Nature).map((_nature) => (
                    <React.Fragment key={randomString(6)}>
                      <CommandItem
                        value={_nature}
                        onSelect={(value) => {
                          setIsOpen(false)
                          setNature(capitalize(value) as NatureType)
                        }}
                        data-cy={`${nature}-value`}
                        className="pl-8 relative"
                      >
                        {nature === _nature ? (
                          <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                        ) : null}
                        {_nature}
                      </CommandItem>
                    </React.Fragment>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
