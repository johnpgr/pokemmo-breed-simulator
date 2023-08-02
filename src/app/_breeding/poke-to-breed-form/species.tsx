import { Button } from '@/app/_components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/app/_components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/_components/ui/popover'
import { ScrollArea } from '@/app/_components/ui/scroll-area'
import { Separator } from '@/app/_components/ui/separator'
import { getSprite, parseNames } from '@/lib/utils'
import clsx from 'clsx'
import { ChevronsUpDown } from 'lucide-react'
import { For, block } from 'million/react'
import React, { Dispatch, Fragment, SetStateAction } from 'react'

export const Species = block(
  ({
    pokemons,
    isOpen,
    setIsOpen,
    onSelect,
    selected,
  }: {
    pokemons: {
      name: string
      number: number
    }[]
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    onSelect: (name: string) => void
    selected: string | undefined
  }) => {
    const [search, setSearch] = React.useState('')
    return (
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={'ghost'}
              className={clsx('border', {
                'pl-2': selected,
                'pl-4': !selected,
              })}
            >
              {selected ? (
                <img
                  className="top-[1px] left-0"
                  src={getSprite(selected)}
                  style={{
                    imageRendering: 'pixelated',
                  }}
                />
              ) : null}
              {selected ? parseNames(selected) : 'Select a pokemon'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput
                placeholder="Search pokemon..."
                value={search}
                onValueChange={setSearch}
                data-cy="search-pokemon-input"
              />
              <CommandEmpty>No results</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72">
                  <For
                    each={pokemons.filter((pokemon) =>
                      pokemon.name.toLowerCase().includes(search.toLowerCase()),
                    )}
                  >
                    {(pokemon) => (
                      <Fragment key={`pokemon_to_breed:${pokemon.name}`}>
                        <CommandItem
                          value={pokemon.name}
                          onSelect={onSelect}
                          data-cy={`${pokemon.name}-value`}
                          className='cursor-pointer'
                        >
                          {parseNames(pokemon.name)}
                        </CommandItem>
                        <Separator />
                      </Fragment>
                    )}
                  </For>
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)
