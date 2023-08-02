'use client'
import { Label } from '@/app/_components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import { IVs } from '@/app/_context/types'
import { Keys, camelToSpacedPascal, randomString } from '@/lib/utils'
import React from 'react'

const numberOfPokemons = {
  2: { natured: [2, 1], natureless: [1, 1] },
  3: { natured: [4, 2, 1], natureless: [2, 1, 1] },
  4: { natured: [6, 5, 3, 1], natureless: [3, 2, 2, 1] },
  5: { natured: [11, 10, 6, 2, 2], natureless: [5, 5, 3, 2, 1] },
} as const

const ivs = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed',
] satisfies Keys<IVs>[]

const Ivs = React.memo(
  ({
    natured,
    onChange,
  }: {
    natured: boolean
    onChange: (ivs: Keys<IVs>) => void
  }) => {
    const [numberOf31IVs, setNumberOf31IVs] = React.useState<2 | 3 | 4 | 5>(2)
    const pokeNumbers = natured
      ? numberOfPokemons[numberOf31IVs].natured
      : numberOfPokemons[numberOf31IVs].natureless

    return (
      <div>
        <RadioGroup
          className="border rounded w-fit flex"
          defaultValue={'2'}
          onValueChange={(v) => setNumberOf31IVs(parseInt(v) as 2 | 3 | 4 | 5)}
        >
          <RadioGroupItem className="border-0" value={'2'}>
            2
          </RadioGroupItem>
          <RadioGroupItem className="border-0" value={'3'}>
            3
          </RadioGroupItem>
          <RadioGroupItem className="border-0" value={'4'}>
            4
          </RadioGroupItem>
          <RadioGroupItem className="border-0" value={'5'}>
            5
          </RadioGroupItem>
        </RadioGroup>
        <div className="flex flex-col md:flex-row items-center gap-2">
          {pokeNumbers.map((n) => (
            <div key={randomString(6)} className="w-full">
              <Label
                key={randomString(6)}
                className="text-sm text-foreground/70"
              >
                <strong className="text-lg text-foreground mr-1">{n}</strong>{' '}
                1x31 IV in
              </Label>
              <Select onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick an IV" />
                </SelectTrigger>
                <SelectContent>
                  {ivs.map((iv) => (
                    <SelectItem key={randomString(6)} value={iv}>
                      {camelToSpacedPascal(iv)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    )
  },
)

Ivs.displayName = 'Ivs'
export { Ivs }
