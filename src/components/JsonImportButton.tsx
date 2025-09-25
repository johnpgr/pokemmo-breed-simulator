import React from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Import, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function JsonImportButton(props: {
  handleImportJson: (data: string) => void
}) {
  const [jsonData, setJsonData] = React.useState("")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="gap-2" type="button" variant={"secondary"}>
          <Import size={16} />
          Import
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-96 flex-col gap-4">
        <pre spellCheck={false}>
          <code>
            <Textarea
              className="w-full resize-none border-none"
              rows={16}
              value={jsonData}
              onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
            />
          </code>
        </pre>
        <Button
          className="gap-1"
          onClick={() => props.handleImportJson(jsonData)}
        >
          <Save size={16} />
          Save
        </Button>
      </PopoverContent>
    </Popover>
  )
}
