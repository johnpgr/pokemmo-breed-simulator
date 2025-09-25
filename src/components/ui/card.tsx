import * as React from "react"
import { cn } from "@/lib/utils"

const Card = ({ ref, className, ...props }: React.ComponentProps<"div">) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
)

const CardHeader = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
)

const CardTitle = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"h3">) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
)

const CardDescription = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"p">) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)

const CardContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
)

const CardFooter = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
