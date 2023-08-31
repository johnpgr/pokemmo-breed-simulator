import { Female, Male } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { IV } from "@/context/types"
import { camelToSpacedPascal, getSprite, randomString } from "@/lib/utils"
import { HelpCircle } from "lucide-react"
import React from "react"
import { Gender } from "../../consts"
import type { BreedNode, GenderType, Position } from "../../types"
import type { useBreedMap } from "../../use-breed-map"
import { getBreedPartnerPosition as getBreedingPartnerPosition } from "../../utils"
import { HeldItemsView } from "./held-items"

//TODO: Improve the UI on this.
export function CurrentNodeInformationCard(props: {
  currentNode: BreedNode
  gender: GenderType | null
  setGender: (gender: GenderType) => void
  position: Position
  breedMap: ReturnType<typeof useBreedMap>
}) {
  function onCheckedChange(value: boolean) {
    props.setGender(value ? Gender.FEMALE : Gender.MALE)
  }

  function getIVDifferenceFromBreedPartner(self: Array<IV>, breedPartner: Array<IV> | BreedPartnerIsNatureOnly): IV {
    if (breedPartner instanceof BreedPartnerIsNatureOnly) {
      //This means that self is one iv only, so get the first element is fine
      return self[0]
    }

    const ivThatDoesntExistOnBreedPartner = self.filter((iv) => !breedPartner.includes(iv))

    return ivThatDoesntExistOnBreedPartner[0]
  }

  const breedPartnerPos = props.position === "0,0" ? null : getBreedingPartnerPosition(props.position)
  const IVsFromBreedPartner = breedPartnerPos
    ? props.breedMap.get(breedPartnerPos)?.ivs ?? new BreedPartnerIsNatureOnly()
    : null

  const ivDifferenceFromBreedPartner =
    IVsFromBreedPartner &&
    props.currentNode.ivs &&
    getIVDifferenceFromBreedPartner(props.currentNode.ivs, IVsFromBreedPartner)

  return (
    <Card className="w-fit h-fit relative">
      <CardHeader className="pb-2 pt-4">
        <HeldItemsView
          item={
            //if not natured, ivs must exist.
            props.currentNode.nature ? "nature" : ivDifferenceFromBreedPartner!
          }
        />
        <CardTitle className="flex items-center">
          {props.currentNode.pokemon ? (
            <React.Fragment>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getSprite(props.currentNode.pokemon.name)}
                style={{
                  imageRendering: "pixelated",
                }}
                alt={props.currentNode.pokemon.name}
                className="mb-1"
              />
              {props.currentNode.pokemon.name}
            </React.Fragment>
          ) : (
            <HelpCircle size={32} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <div className="flex flex-col gap-1">
          {Boolean(props.currentNode.ivs) ? <p>Ivs:</p> : null}
          {props.currentNode.ivs?.map((iv) => <span key={randomString(4)}>31 {camelToSpacedPascal(iv)}</span>)}
        </div>
        {props.currentNode.nature && <i className="block">{props.currentNode.nature}</i>}
        {props.currentNode.pokemon ? (
          <React.Fragment>
            <div className="flex flex-col gap-1">
              <p>Egg Groups:</p>
              {props.currentNode.pokemon.eggTypes.map((egg) => (
                <span key={randomString(3)}>{egg}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <Male className="fill-blue-500 h-6 w-fit" />
              <Switch
                className="data-[state=unchecked]:bg-primary"
                checked={props.gender === Gender.FEMALE}
                onCheckedChange={onCheckedChange}
              />
              <Female className="fill-pink-500 h-6 w-fit -ml-1" />
            </div>
          </React.Fragment>
        ) : null}
      </CardContent>
    </Card>
  )
}

class BreedPartnerIsNatureOnly {}
