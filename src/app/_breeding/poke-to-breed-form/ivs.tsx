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
    setIvs,
  }: {
    natured: boolean
    setIvs: React.Dispatch<React.SetStateAction<IVs>>
  }) => {
    const [numberOf31IVs, setNumberOf31IVs] = React.useState<2 | 3 | 4 | 5>(2)
    const [currentValues, setCurrentValues] = React.useState<Keys<IVs>[]>([
      'hp',
      'attack',
      'defense',
      'specialDefense',
      'speed',
    ])

    function hadleNumberOf31Ivs(number: string) {
      const value = parseInt(number) as 2 | 3 | 4 | 5
      switch (value) {
        case 2:
          setIvs({
            hp: null,
            attack: null,
            defense: null,
            specialAttack: null,
            specialDefense: null,
            speed: null,
            [currentValues[0]]: 31,
            [currentValues[1]]: 31,
          })
          break
        case 3:
          setIvs({
            hp: null,
            attack: null,
            defense: null,
            specialAttack: null,
            specialDefense: null,
            speed: null,
            [currentValues[0]]: 31,
            [currentValues[1]]: 31,
            [currentValues[2]]: 31,
          })
          break
        case 4:
          setIvs({
            hp: null,
            attack: null,
            defense: null,
            specialAttack: null,
            specialDefense: null,
            speed: null,
            [currentValues[0]]: 31,
            [currentValues[1]]: 31,
            [currentValues[2]]: 31,
            [currentValues[3]]: 31,
          })
          break
        case 5:
          setIvs({
            hp: null,
            attack: null,
            defense: null,
            specialAttack: null,
            specialDefense: null,
            speed: null,
            [currentValues[0]]: 31,
            [currentValues[1]]: 31,
            [currentValues[2]]: 31,
            [currentValues[3]]: 31,
            [currentValues[4]]: 31,
          })
          break
      }
      setNumberOf31IVs(value)
    }

    const pokeNumbers = natured
      ? numberOfPokemons[numberOf31IVs].natured
      : numberOfPokemons[numberOf31IVs].natureless

    function handleChange(index: number, iv: Keys<IVs>) {
      const previousValue = currentValues[index]
      const newValues = [...currentValues]
      newValues[index] = iv
      setIvs((prev) => {
        return {
          ...prev,
          [previousValue]: isPreviousValueIsCurrentlySelected(
            index,
            previousValue,
          )
            ? prev[previousValue]
            : null,
          [iv]: 31,
        } as IVs
      })
      setCurrentValues(newValues)
    }

    function isPreviousValueIsCurrentlySelected(
      currentValueIndex: number,
      prev: Keys<IVs>,
    ) {
      const currentSelects: Keys<IVs>[] = []

      for(let i = 0; i < numberOf31IVs; i ++) {
        if(i === currentValueIndex) continue
        const value = currentValues[i]
        currentSelects.push(value)
      }

      return currentSelects.includes(prev)
    }

    return (
      <div>
        <RadioGroup
          className="border rounded w-fit flex"
          defaultValue={'2'}
          onValueChange={hadleNumberOf31Ivs}
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
          {pokeNumbers.map((n, i) => (
            <div key={randomString(6)} className="w-full">
              <Label
                key={randomString(6)}
                className="text-sm text-foreground/70"
              >
                <strong className="text-lg text-foreground mr-1">{n}</strong>{' '}
                1x31 IV in
              </Label>
              <Select
                value={currentValues[i]}
                onValueChange={(v) => handleChange(i, v as Keys<IVs>)}
              >
                <SelectTrigger>
                  <SelectValue aria-label={currentValues[i]}>
                    {camelToSpacedPascal(currentValues[i])}
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
