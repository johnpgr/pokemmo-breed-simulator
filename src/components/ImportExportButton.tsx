import React from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Import, ClipboardCopy, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import z from "zod"
import { BreedContext } from "@/contexts/breed-context/store"
import { ZBreedMap } from "@/core/breed-map"

export function ImportExportButton(props: { serialize: () => string }) {
  const ctx = React.use(BreedContext)
  const [jsonData, setJsonData] = React.useState("")

  function handleSave() {
    let unparsed
    try {
      unparsed = JSON.parse(jsonData)
    } catch (error) {
      toast.error("Failed to save the breed tree JSON content.", {
        description: (error as Error).message,
      })
    }

    const res = ZBreedMap.safeParse(unparsed)
    if (res.error) {
      toast.error("Failed to save the breed tree JSON content.", {
        description: z.prettifyError(res.error),
      })
      return
    }

    try {
      ctx.deserialize(res.data)
    } catch (error) {
      toast.error("Failed to save the breed tree JSON content.", {
        description: (error as Error).message ?? "",
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="gap-1"
          variant={"secondary"}
          onClick={() => setJsonData(props.serialize())}
        >
          <Import size={16} />
          Import/Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative flex h-96 w-96 flex-col gap-4">
        <pre className="flex-1 overflow-auto border rounded-md" spellCheck={false}>
          <code className="block h-full">
            <Textarea
              className="w-full h-full resize-none border-none min-h-0 bg-transparent font-mono"
              value={jsonData}
              onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
              placeholder="Paste your JSON data here..."
            />
          </code>
        </pre>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                size={"icon"}
                className="absolute top-6 right-8 h-8 w-8 md:right-10"
                onClick={() => {
                  navigator.clipboard
                    .writeText(jsonData)
                    .then(() => {
                      toast("Copy success.", {
                        description:
                          "The current breed state was copied to your clipboard.",
                      })
                    })
                    .catch(() => {
                      toast.error("Copy failed.", {
                        description: "Failed to copy breed contents.",
                      })
                    })
                }}
              >
                <ClipboardCopy size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={handleSave} className="gap-1">
          <Save size={16} />
          Save
        </Button>
      </PopoverContent>
    </Popover>
  )
}
