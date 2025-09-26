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

export interface PokemonNodeHeldItemProps {
  item: HeldItem
}

export const PokemonNodeHeldItem: React.FC<PokemonNodeHeldItemProps> = ({
  item,
}) => {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"secondary"}
            className="hover:bg-secondary dark:hover:bg-secondary h-fit w-fit rounded-full border p-0 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none dark:hover:ring-neutral-700 dark:focus:ring-neutral-700"
          >
            <img
              src={getEvItemSpriteUrl(item)}
              alt={`Held item: ${item}`}
              style={{
                imageRendering: "pixelated",
              }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{kebabToSpacedPascal(item)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
