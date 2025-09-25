import React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const PokemonIvRadioGroup: React.FC<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>
> = ({ className, ref, ...props }) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid bg-card gap-2 overflow-hidden", className)}
      {...props}
      ref={ref}
    />
  )
}

const PokemonIvRadioItem: React.FC<
  React.ComponentProps<typeof RadioGroupPrimitive.Item>
> = ({ className, children, ref, ...props }) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "cursor-pointer aria-checked:text-primary-foreground border-primary ring-offset-background focus-visible:ring-ring relative aspect-square h-8 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="bg-primary flex h-full w-full items-center justify-center"></RadioGroupPrimitive.Indicator>
      <div className="absolute inset-0 mt-1">{children}</div>
    </RadioGroupPrimitive.Item>
  )
}

export { PokemonIvRadioGroup, PokemonIvRadioItem }
