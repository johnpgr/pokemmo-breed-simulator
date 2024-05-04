"use client"
import React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const PokemonIvRadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2 overflow-hidden", className)}
            {...props}
            ref={ref}
        />
    )
})
PokemonIvRadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const PokemonIvRadioItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "aspect-square h-8 relative aria-checked:text-primary-foreground rounded border border-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center bg-primary h-full w-full"></RadioGroupPrimitive.Indicator>
            <div className="absolute inset-0 mt-1">{children}</div>
        </RadioGroupPrimitive.Item>
    )
})
PokemonIvRadioItem.displayName = RadioGroupPrimitive.Item.displayName

export { PokemonIvRadioGroup, PokemonIvRadioItem }
