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
import { IV } from '@/app/_context/types'
import { Keys, camelToSpacedPascal, randomString } from '@/lib/utils'
import React from 'react'
import { numberOfPokemonsFromIVNumber } from '../consts'

const ivs = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed',
] satisfies IV[]

const Ivs = React.memo(
  ({
    natured,
    setIvs,
    currentSelectValues,
    setCurrentSelectValues,
    numberOf31IVs,
    setNumberOf31IVs,
  }: {
    natured: boolean
    setIvs: React.Dispatch<React.SetStateAction<IV[]>>
    currentSelectValues: IV[]
    setCurrentSelectValues: React.Dispatch<React.SetStateAction<IV[]>>
    numberOf31IVs: 2 | 3 | 4 | 5
    setNumberOf31IVs: React.Dispatch<React.SetStateAction<2 | 3 | 4 | 5>>
  }) => {
    function handleNumberOf31Ivs(number: string) {
      const value = parseInt(number) as 2 | 3 | 4 | 5
      switch (value) {
        case 2:
          setIvs([currentSelectValues[0], currentSelectValues[1]])
          break
        case 3:
          {
            setIvs([
              ...new Set([
                currentSelectValues[0],
                currentSelectValues[1],
                currentSelectValues[2],
              ]),
            ])
          }
          break
        case 4:
          {
            setIvs([
              ...new Set([
                currentSelectValues[0],
                currentSelectValues[1],
                currentSelectValues[2],
                currentSelectValues[3],
              ]),
            ])
          }
          break
        case 5:
          {
            setIvs([
              ...new Set([
                currentSelectValues[0],
                currentSelectValues[1],
                currentSelectValues[2],
                currentSelectValues[3],
                currentSelectValues[4],
              ]),
            ])
          }
          break
      }
      setNumberOf31IVs(value)
    }

    const pokeNumbers = natured
      ? numberOfPokemonsFromIVNumber[numberOf31IVs].natured
      : numberOfPokemonsFromIVNumber[numberOf31IVs].natureless

    function handleChange(value: IV, index: number) {
      const previousValue = currentSelectValues[index]
      const newValues = [...currentSelectValues]
      newValues[index] = value

      setIvs((prev) => {
        const newIvs = new Set([...prev])
        if (!isPreviousValueCurrentlySelected(previousValue, index)) {
          newIvs.delete(previousValue)
        }
        newIvs.add(value)
        return Array.from(newIvs)
      })

      setCurrentSelectValues(newValues)
    }

    function isPreviousValueCurrentlySelected(
      value: IV,
      currentValueIndex: number,
    ) {
      const currentSelects: IV[] = []

      for (let i = 0; i < numberOf31IVs; i++) {
        if (i === currentValueIndex) continue
        const value = currentSelectValues[i]
        currentSelects.push(value)
      }

      return currentSelects.includes(value)
    }
    return (
      <div>
        <RadioGroup
          className="border rounded w-fit flex"
          defaultValue={'2'}
          onValueChange={handleNumberOf31Ivs}
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
          {Object.entries(pokeNumbers).map(([key, value], i) => (
            <div key={randomString(6)} className="w-full">
              <Label
                key={randomString(6)}
                className="text-sm text-foreground/70"
              >
                <strong className="text-lg text-foreground mr-1">
                  {value}
                </strong>{' '}
                1x31 IV in
              </Label>
              <Select
                value={currentSelectValues[i]}
                onValueChange={(v) => handleChange(v as IV, i)}
              >
                <SelectTrigger>
                  <SelectValue aria-label={currentSelectValues[i]}>
                    {camelToSpacedPascal(currentSelectValues[i])}
                  </SelectValue>
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
