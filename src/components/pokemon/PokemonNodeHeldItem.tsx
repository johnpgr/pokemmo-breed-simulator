import { getEvItemSpriteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { kebabToSpacedPascal } from "@/lib/utils"
import type { HeldItem } from "@/core/held-item"

export function PokemonNodeHeldItem(props: { item: HeldItem }) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"secondary"} className="h-fit w-fit rounded-full p-0 border hover:bg-secondary dark:hover:bg-secondary hover:ring-2 hover:ring-offset-2 hover:ring-neutral-400 dark:hover:ring-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 dark:focus:ring-neutral-700">
            <img
              src={getEvItemSpriteUrl(props.item)}
              alt={`Held item: ${props.item}`}
              style={{
                imageRendering: "pixelated",
              }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{kebabToSpacedPascal(props.item)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}