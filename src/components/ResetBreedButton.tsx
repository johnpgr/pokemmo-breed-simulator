import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { BreedContext } from "@/contexts/breed-context/store"
import React from "react"

export const ResetBreedButton: React.FC = () => {
  const ctx = React.useContext(BreedContext)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"} className="gap-1">
            <RotateCcw size={16} />
            Reset
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset current breed</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the current breed?
              <br />
              All progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"destructive"} onClick={ctx.reset}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"destructive"} className="gap-1">
          <RotateCcw size={16} />
          Reset
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Reset current breed</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to reset the current breed? All progress will
            be lost.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant={"destructive"} onClick={ctx.reset}>
              Confirm
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
